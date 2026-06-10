import yaml
import os
import sys
import subprocess

def find_project_tex(name):
    """Finds the path to a project's .tex file, checking legacy location and ../projects."""
    # 1. Check legacy location (just in case)
    legacy_path = os.path.join('resume', 'projects', f'{name}.tex')
    if os.path.exists(legacy_path):
        return legacy_path

    # 2. Check in ../projects directory recursively
    projects_dir = '../projects'
    if os.path.exists(projects_dir):
        for root, dirs, files in os.walk(projects_dir):
            if f'{name}.tex' in files:
                # Get path relative to the current directory (src/data/resume)
                rel_path = os.path.relpath(os.path.join(root, f'{name}.tex'), '.')
                return rel_path

    return None

def generate_build_file(config_path, output_file='build.tex'):
    """Generates the build.tex file from a given config."""
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    with open(output_file, 'w') as f:
        # 1. Contact Info
        contact_type = config.get('contact', ['full'])[0]
        f.write(f'\\input{{resume/contact/{contact_type}.tex}}\n\n')

        # 2. Education
        if config.get('education'):
            f.write('\\section*{Education}\n')
            for item in config['education']:
                f.write(f'\\input{{resume/education/{item}.tex}}\n\n')

        # 3. Technical Skills
        if config.get('skills'):
            f.write('\\section*{Technical Skills}\n')
            for item in config['skills']:
                f.write(f'\\input{{resume/skills/{item}.tex}}\\\n')
            f.write('\n\n')

        # 4. Experience
        if config.get('experience'):
            f.write('\\section*{Experience}\n')
            for item in config['experience']:
                f.write(f'\\input{{resume/experience/{item}.tex}}\n\n')

        # 5. Projects
        if config.get('projects'):
            f.write('\\section*{Projects \\& Leadership}\n')
            for item in config['projects']:
                tex_path = find_project_tex(item)
                if tex_path:
                    tex_path_latex = tex_path.replace('\\', '/')
                    f.write(f'\\input{{{tex_path_latex}}}\n\n')
                else:
                    print(f"Warning: Project tex file for '{item}' not found.")

def compile_latex(job_name, output_dir='.'):
    """Compiles main.tex into a PDF with a specific job name."""
    print(f"--- Compiling {job_name}.pdf ---")
    try:
        subprocess.run(
            ['pdflatex', '-jobname', job_name, '-output-directory', output_dir, 'main.tex'],
            check=True,
            capture_output=True,
            text=True
        )
        print(f"Successfully compiled {os.path.join(output_dir, job_name)}.pdf")
    except subprocess.CalledProcessError as e:
        print(f"Error compiling {job_name}.pdf.")
        print(e.stdout)
        print(e.stderr)
        sys.exit(1)

def build_single_resume(name, output_dir='.'):
    """Builds a single resume based on the config name."""
    config_file = f"configs/config_{name}.yml"
    if not os.path.exists(config_file):
        print(f"Error: Configuration file {config_file} not found.")
        sys.exit(1)

    print(f"Generating build.tex for '{name}'...")
    generate_build_file(config_file)
    compile_latex(f"Resume_{name.capitalize()}", output_dir)

def build_all_resumes(output_dir='.'):
    """Builds all resumes from the configs directory."""
    print("Building all resumes in 'configs/' directory...")
    config_dir = 'configs'
    for filename in os.listdir(config_dir):
        if filename.startswith('config_') and filename.endswith('.yml'):
            name = filename.replace('config_', '').replace('.yml', '')
            build_single_resume(name, output_dir)

def main(args=None):
    if args is None:
        args = sys.argv[1:]
    output_directory = '.'

    if '--output-dir' in args:
        try:
            index = args.index('--output-dir')
            output_directory = args[index + 1]
            os.makedirs(output_directory, exist_ok=True)
            # Remove the flag and its value from the list
            args.pop(index)
            args.pop(index)
        except (ValueError, IndexError):
            print("Error: --output-dir flag must be followed by a directory path.")
            sys.exit(1)

    if len(args) > 0:
        # Build a specific resume
        resume_name = args[0]
        build_single_resume(resume_name, output_directory)
    else:
        # Build all resumes
        build_all_resumes(output_directory)

    # Automatically copy to public/resumes for the Vite dev server/build if it exists
    public_resumes_dir = os.path.join('..', '..', '..', 'public', 'resumes')
    if os.path.exists(public_resumes_dir):
        import shutil
        for filename in os.listdir(output_directory):
            if filename.startswith('Resume_') and filename.endswith('.pdf'):
                shutil.copy(os.path.join(output_directory, filename), os.path.join(public_resumes_dir, filename))
                print(f"Copied {filename} to public/resumes/")

    if os.path.exists('build.tex'):
        os.remove('build.tex')

if __name__ == '__main__':
    main()
