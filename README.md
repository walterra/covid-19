# covid-19
Personal COVID-19 data exploration with a focus on Austria.

Visit the website with chart renderings here: https://walterra.github.io/covid-19/

The code that creates the VEGA specifications for the charts can be found in this Jupyter Notebook: https://github.com/walterra/covid-19/blob/master/jupyter/covid19-at.ipynb

# development

To run an edit the Jupyter Notebook:

```bash
jupyter notebook
```

To run a web server to run the website locally:

```bash
npm run http-server
```

To get the latest date, run the jupyter notebook in headless mode and update the VEGA specs:

```bash
npm run all
```
