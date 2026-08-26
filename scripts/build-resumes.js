import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8089;

// Recursively finds every .yml config file under a directory.
function findConfigFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findConfigFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.yml')) {
            results.push(fullPath);
        }
    }
    return results;
}

// Derives the `?config=` name for a config file, mirroring src/pages/resume.ts,
// e.g. "configs/config_full.yml" -> "full"
// "configs/bostondynamics/config_fleet_operations.yml" -> "bostondynamics/fleet_operations"
function configNameFromFile(configsDir, filePath) {
    const relative = path.relative(configsDir, filePath).split(path.sep).join('/');
    const segments = relative.replace(/\.yml$/, '').split('/');
    segments[segments.length - 1] = segments[segments.length - 1].replace(/^config_/, '');
    return segments.join('/');
}

// Turns a config name into a PDF-friendly PascalCase filename segment,
// e.g. "bostondynamics/fleet_operations" -> "Bostondynamics_FleetOperations"
function configNameToPdfName(configName) {
    const pascalCase = (segment) => segment
        .split('_')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    return configName.split('/').map(pascalCase).join('_');
}

// Simple static server for dist directory
function createServer(port) {
    const distDir = path.join(__dirname, '..', 'dist');
    return http.createServer((req, res) => {
        // Safe path resolution
        let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
        
        // Simple MIME type map
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg') contentType = 'image/jpeg';
        else if (ext === '.json') contentType = 'application/json';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // Fallback to index.html for SPA router
                    fs.readFile(path.join(distDir, 'index.html'), (err2, indexContent) => {
                        if (err2) {
                            res.writeHead(500);
                            res.end('Error loading index.html');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(indexContent);
                        }
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    });
}

async function run() {
    console.log('Starting static server to serve dist/ ...');
    const server = createServer(PORT);
    
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Server running at http://localhost:${PORT}`);

    const outputDir = path.join(__dirname, '../src/data/resume/generated');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const publicResumesDir = path.join(__dirname, '../public/resumes');
    if (!fs.existsSync(publicResumesDir)) {
        fs.mkdirSync(publicResumesDir, { recursive: true });
    }

    let browser;
    try {
        console.log('Launching headless browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        const configsDir = path.join(__dirname, '../src/data/resume/configs');
        const configFiles = findConfigFiles(configsDir);
        const configs = configFiles.map(filePath => configNameFromFile(configsDir, filePath));
        console.log(`Discovered configs: ${configs.join(', ')}`);

        for (const config of configs) {
            const url = `http://localhost:${PORT}/#/resume?config=${encodeURIComponent(config)}`;
            console.log(`Navigating to: ${url}`);

            // Go to page and wait for network to be idle
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Give QR codes a moment to render
            await new Promise(r => setTimeout(r, 1000));

            const pdfName = `Resume_${configNameToPdfName(config)}.pdf`;
            const outputPath = path.join(outputDir, pdfName);
            const publicPath = path.join(publicResumesDir, pdfName);

            console.log(`Generating PDF for ${config}...`);
            await page.pdf({
                path: outputPath,
                format: 'letter',
                printBackground: true,
                margin: {
                    top: '0px',
                    bottom: '0px',
                    left: '0px',
                    right: '0px'
                }
            });

            console.log(`Saved PDF to ${outputPath}`);

            // Copy to public/resumes/
            fs.copyFileSync(outputPath, publicPath);
            console.log(`Copied PDF to ${publicPath}`);
        }

    } catch (err) {
        console.error('Error during PDF generation:', err);
        process.exitCode = 1;
    } finally {
        if (browser) {
            await browser.close();
        }
        server.close(() => {
            console.log('Server stopped.');
        });
    }
}

run();
