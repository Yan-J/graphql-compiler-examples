from graphqlclient import GraphQLClient
import json
client = GraphQLClient('https://api.graph.cool/simple/v1/cj5u5gfmajiig0123trm8ibro')

def get_all_posts():
    file_object = open('js/__generated__/appQuery.graphql') 
    file_context = file_object.read()
    file_object.close()

    result = client.execute(file_context)

    data = json.loads(result)
    posts = data['data']['allPosts']
    return posts

def create_post(title, content, tag):
    result = client.execute('''
    mutation {
        createPost(
            postTitle: "%s"
            postContent: "%s"
            postTag: "%s"
        ) {
            id
            }
    }
        ''' % (str(title), str(content), str(tag)))
    print(result)
    

from flask import Flask, abort, request, render_template
from uuid import uuid4
import requests
import requests.auth
import urllib
import string
import random
import sys
import os

app = Flask(__name__)

# Search bar
@app.route('/', methods=['GET', 'POST'])
def homepage():
    text = '<a href="%s">Test Test</a>'
    return render_template("index.html")

@app.route("/search/", methods=['GET','POST'])
def search():
    title = request.form.get('title')
    content = request.form.get('content')
    tag = request.form.get('tag')
    if (title and content and tag):
        create_post(title, content, tag)
    return render_template('users.html', user_list = get_all_posts())

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    if (sys.argv[1] == '--build'):
        os.system('npm run build -- --extensions graphql')
        print('GraphQL Files Compiled\n')
    run_simple('localhost', 9000, app)
