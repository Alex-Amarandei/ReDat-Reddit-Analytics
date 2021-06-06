const http = require('http')
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const qs = require('querystring')
const url = require('url')
const Communities = require('./src/communities.repo');

const port = 3031;


const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    if (req.method === 'GET') {
        return handleGetReq(req, res)
    } else if (req.method === 'POST') {
        return handlePostReq(req, res)
    } else if (req.method === 'DELETE') {
        return handleDeleteReq(req, res)
    } else if (req.method === 'PUT') {
        return handlePutReq(req, res)
    } else if (req.method === 'OPTIONS') {
        return res.end('OPTIONS')
    }
})

/////////// TEST FUNCTION CALL ONLY WITH AWAIT (ASYNC)


// GET
async function handleGetReq(req, res) {
    const { pathname, query } = url.parse(req.url)

    if (pathname !== '/communities') {
        return handleError(res, 404)
    }

    const { id, redditToken, filterType } = qs.parse(query);
    const userId = id.split('_')[0];


    try {
        var posts = [];
        var responsePosts = [];
        const localDbCommunities = await Communities.getCommunitiesByUser(userId);


        for (i = 0; i < localDbCommunities.length; i++) {
            const getCommunitiesRes = await Communities.getCommunityPosts(filterType, redditToken, localDbCommunities[i].community_name);
            posts = posts.concat(getCommunitiesRes);
        }



        posts.forEach(post => {
            responsePosts = responsePosts.concat({ community: post.data.subreddit, author: post.data.author, title: post.data.title, content: post.data.selftext, createdAt: post.data.created_utc, score: post.data.score })
        })


        res.write(JSON.stringify(responsePosts));
        res.statusCode = 200;
        return res.end();
    } catch (err) {

        console.log(err);
    }




}

// POST
function handlePostReq(req, res) {
    /// REGISTER
    const size = parseInt(req.headers['content-length'], 10)
    const buffer = Buffer.allocUnsafe(size)
    var pos = 0

    const { pathname } = url.parse(req.url)
    if (pathname !== '/dashboard' && pathname !== '/dashoard/prefs') {
        return handleError(res, 404)
    }

    req
        .on('data', (chunk) => {
            const offset = pos + chunk.length
            if (offset > size) {
                reject(413, 'Too Large', res)
                return
            }
            chunk.copy(buffer, pos)
            pos = offset
        })
        .on('end', async() => {
            if (pos !== size) {
                reject(400, 'Bad Request', res)
                return
            }
            const data = JSON.parse(buffer.toString())

            if (pathname === '/dashboard') {
                try {



                } catch (err) {

                }

            }

            res.end();
        })
}

// DELETE
function handleDeleteReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    if (pathname !== '/user') {
        return handleError(res, 404)
    }
    const { id } = qs.parse(query)
        // const userDeleted = Users.deleteUser(id);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(`{"userDeleted": ${id}}`)
}

// PUT
function handlePutReq(req, res) {
    // LOGIN
    const { pathname, query } = url.parse(req.url)
    if (pathname !== '/user') {
        return handleError(res, 404)
    }
    const { id } = qs.parse(query)
    const size = parseInt(req.headers['content-length'], 10)
    const buffer = Buffer.allocUnsafe(size)
    var pos = 0
    req
        .on('data', (chunk) => {
            const offset = pos + chunk.length
            if (offset > size) {
                reject(413, 'Too Large', res)
                return
            }
            chunk.copy(buffer, pos)
            pos = offset
        })
        .on('end', async() => {
            if (pos !== size) {
                reject(400, 'Bad Request', res)
                return
            }

            res.end()
        })
}

function handleError(res, code) {
    res.statusCode = code
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`)
    return;
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});