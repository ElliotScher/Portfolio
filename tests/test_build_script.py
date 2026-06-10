import os
import shutil
import yaml
import pytest
from unittest.mock import patch, MagicMock
import subprocess
import sys

# Add the directory containing build_script.py to search path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/data/resume')))

import build_script

@pytest.fixture(autouse=True)
def manage_dirs():
    # Setup
    old_cwd = os.getcwd()
    test_dir = os.path.dirname(os.path.abspath(__file__))
    script_dir = os.path.abspath(os.path.join(test_dir, '../src/data/resume'))
    
    # Switch working directory to script_dir so relative imports/paths in build_script resolve correctly
    os.chdir(script_dir)
    
    temp_configs_dir = os.path.join(test_dir, 'configs_temp')
    temp_projects_dir = os.path.join(test_dir, 'projects_temp')
    temp_resume_dir = os.path.join(test_dir, 'resume_temp')
    
    os.makedirs(temp_configs_dir, exist_ok=True)
    os.makedirs(temp_projects_dir, exist_ok=True)
    os.makedirs(temp_resume_dir, exist_ok=True)
    
    context = {
        'test_dir': test_dir,
        'temp_configs_dir': temp_configs_dir,
        'temp_projects_dir': temp_projects_dir,
        'temp_resume_dir': temp_resume_dir
    }
    
    yield context
    
    # Teardown
    for folder in [temp_configs_dir, temp_projects_dir, temp_resume_dir]:
        if os.path.exists(folder):
            shutil.rmtree(folder)
            
    build_tex_path = os.path.join(script_dir, 'build.tex')
    if os.path.exists(build_tex_path):
        os.remove(build_tex_path)
        
    os.chdir(old_cwd)

def test_find_project_tex_locates_files(manage_dirs):
    temp_projects_dir = manage_dirs['temp_projects_dir']
    # Create a mock project tex file deep inside a project structure
    nested_dir = os.path.join(temp_projects_dir, 'subfolder', 'myproject')
    os.makedirs(nested_dir, exist_ok=True)
    tex_file_path = os.path.join(nested_dir, 'myproject.tex')
    with open(tex_file_path, 'w') as f:
        f.write('% test LaTeX content')

    # Patch the hardcoded '../projects' path inside find_project_tex to projects_temp
    original_exists = os.path.exists
    with patch('os.path.exists', side_effect=lambda path: True if 'projects_temp' in path or path == temp_projects_dir else original_exists(path)):
        with patch('os.walk', return_value=[(nested_dir, [], ['myproject.tex'])]):
            found_path = build_script.find_project_tex('myproject')
            assert found_path is not None
            assert found_path.endswith('myproject.tex')

def test_generate_build_file_creates_correct_latex(manage_dirs):
    temp_configs_dir = manage_dirs['temp_configs_dir']
    # Write a mock config
    config = {
        'contact': ['redacted'],
        'education': ['wpi'],
        'skills': ['software'],
        'experience': ['wpi_rrc'],
        'projects': ['gompeivision']
    }
    config_path = os.path.join(temp_configs_dir, 'config_test.yml')
    with open(config_path, 'w') as f:
        yaml.dump(config, f)

    # Mock the find_project_tex return value to avoid filesystem lookups
    with patch('build_script.find_project_tex', return_value='projects_temp/gompeivision/gompeivision.tex'):
        build_script.generate_build_file(config_path, output_file='build.tex')
        
        assert os.path.exists('build.tex')
        with open('build.tex', 'r') as f:
            content = f.read()
        
        # Assert correct LaTeX instructions were generated in the stitcher
        assert '\\input{resume/contact/redacted.tex}' in content
        assert '\\section*{Education}' in content
        assert '\\input{resume/education/wpi.tex}' in content
        assert '\\section*{Technical Skills}' in content
        assert '\\input{resume/skills/software.tex}' in content
        assert '\\section*{Experience}' in content
        assert '\\input{resume/experience/wpi_rrc.tex}' in content
        assert '\\section*{Projects \\& Leadership}' in content
        assert '\\input{projects_temp/gompeivision/gompeivision.tex}' in content

@patch('subprocess.run')
def test_compile_latex_success(mock_run):
    # compile_latex should call subprocess.run with specific args
    build_script.compile_latex('TestResume', 'out_dir')
    mock_run.assert_called_once_with(
        ['pdflatex', '-jobname', 'TestResume', '-output-directory', 'out_dir', 'main.tex'],
        check=True,
        capture_output=True,
        text=True
    )

@patch('subprocess.run')
def test_compile_latex_failure(mock_run):
    # Mock subprocess.run raising CalledProcessError
    mock_run.side_effect = subprocess.CalledProcessError(
        returncode=1,
        cmd=['pdflatex'],
        output='pdflatex error output',
        stderr='pdflatex stderr output'
    )
    with pytest.raises(SystemExit) as exc_info:
        build_script.compile_latex('TestResume', 'out_dir')
    assert exc_info.value.code == 1

@patch('build_script.compile_latex')
@patch('build_script.generate_build_file')
@patch('os.path.exists')
def test_build_single_resume(mock_exists, mock_generate, mock_compile):
    mock_exists.return_value = True
    build_script.build_single_resume('full', 'out_dir')
    
    mock_exists.assert_called_with('configs/config_full.yml')
    mock_generate.assert_called_once_with('configs/config_full.yml')
    mock_compile.assert_called_once_with('Resume_Full', 'out_dir')

@patch('build_script.build_single_resume')
@patch('os.listdir')
def test_build_all_resumes(mock_listdir, mock_build_single):
    mock_listdir.return_value = ['config_full.yml', 'config_redacted.yml', 'other_file.txt']
    build_script.build_all_resumes('out_dir')
    
    assert mock_build_single.call_count == 2
    mock_build_single.assert_any_call('full', 'out_dir')
    mock_build_single.assert_any_call('redacted', 'out_dir')

@patch('build_script.build_all_resumes')
@patch('build_script.build_single_resume')
@patch('os.path.exists')
def test_main_cli_defaults(mock_exists, mock_build_single, mock_build_all):
    mock_exists.return_value = False # public/resumes doesn't exist
    build_script.main(args=[])
    mock_build_all.assert_called_once_with('.')
    mock_build_single.assert_not_called()

@patch('build_script.build_all_resumes')
@patch('build_script.build_single_resume')
@patch('os.path.exists')
def test_main_cli_specific_resume(mock_exists, mock_build_single, mock_build_all):
    mock_exists.return_value = False
    build_script.main(args=['redacted'])
    mock_build_single.assert_called_once_with('redacted', '.')
    mock_build_all.assert_not_called()

@patch('build_script.build_all_resumes')
@patch('build_script.build_single_resume')
@patch('os.path.exists')
@patch('os.makedirs')
def test_main_cli_output_dir(mock_makedirs, mock_exists, mock_build_single, mock_build_all):
    mock_exists.return_value = False
    build_script.main(args=['--output-dir', 'custom_out', 'redacted'])
    mock_makedirs.assert_called_once_with('custom_out', exist_ok=True)
    mock_build_single.assert_called_once_with('redacted', 'custom_out')
    mock_build_all.assert_not_called()

if __name__ == '__main__':
    sys.exit(pytest.main([__file__]))
