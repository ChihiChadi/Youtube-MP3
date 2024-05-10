async function downloadMP3() {
    const urlInput = document.getElementById('urlInput').value;

    // Validate YouTube URL
    if (!isValidURL(urlInput)) {
        alert('Please enter a valid YouTube URL.');
        return;
    }

    // Extract video ID from URL
    const videoId = extractVideoId(urlInput);
    console.log('Video ID:', videoId);

    try {
        // Fetch video information from proxy server
        const response = await fetch(`http://localhost:3000/get_video_info?video_id=${videoId}`);
        const data = await response.text();
        console.log('Response from proxy server:', data);
        
        const parsedData = parseQueryString(data);
        console.log('Parsed Data:', parsedData);

        // Extract audio stream URL
        const audioUrl = parsedData.url_encoded_fmt_stream_map.split(',')
            .map(item => parseQueryString(item))
            .find(item => item.type.includes('audio/mp4'))
            .url;
        console.log('Audio URL:', audioUrl);

        // Trigger download
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'audio.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to download MP3. Please try again later.');
    }
}

function isValidURL(url) {
    // Basic URL validation for YouTube
    return /^https?:\/\/(?:www\.)?youtube.com\/watch\?/.test(url);
}

function extractVideoId(url) {
    // Extracts video ID from YouTube URL
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

function parseQueryString(queryString) {
    // Parse query string into object
    const params = {};
    const keyValuePairs = queryString.split('&');
    keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}
