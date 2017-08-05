
# MicroBlogDemo

This is a simple micro-blogging web application implemented in Python+Flask, with its backend talking to a GraphQL server.
It also leverages the graphql-compiler toolkit to optimize GraphQL queries at build time.

To run the demo, clone the repo, go to the `MicroBlogDemo` directory.

* Run `pip install -r requirements.txt` to install python dependencies.
* Then run `yarn` to install node modules.
* Finally, run `python DEMO.py --build` to start the demo app in build mode, which optimizes the queries before the web app runs.
