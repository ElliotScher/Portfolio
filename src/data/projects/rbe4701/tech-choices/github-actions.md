### Why GitHub Actions?

The team used GitHub Actions as a CI gate for the shared repository:

* **Required Checks on Pull Requests**: Pull requests had to pass the test suite before they could be merged, which kept one teammate's changes from silently breaking another variant.
* **Automatic Project Discovery**: The workflow finds every project directory with a `pyproject.toml` and runs its tests in a separate matrix job, so new homework and project folders were covered without editing the workflow.
* **Reproducible Environments**: Each job installs dependencies with `uv` from the lockfile, so CI used the same package versions as local development.
