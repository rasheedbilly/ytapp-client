const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const axios = require('axios')
app.get('/youtube', (req, res) => {
    playlist_id = req.query.playlist_id; //PLBCF2DAC6FFB574DE
    url = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId='+playlist_id+'&key=AIzaSyBK9I7LUg_7JHmSg8QrNhxkwK98MnuOKKQ'
    axios.get(url).then((response) => {
            data = response.data
            title_list=[]
            for(i = 0; i < data.items.length; i++){
                title_list.push(data.items[i].snippet.title)
            }
            res.status(200).send(title_list)
        });
    
})
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

//Please be responsible with my API key :)
//API Key - AIzaSyBK9I7LUg_7JHmSg8QrNhxkwK98MnuOKKQ
//Test URL - https://www.youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU
//https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=PLBCF2DAC6FFB574DE&key=AIzaSyBK9I7LUg_7JHmSg8QrNhxkwK98MnuOKKQ