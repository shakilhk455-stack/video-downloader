<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TikTok Video Downloader</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .input-group {
            position: relative;
            margin-bottom: 15px;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px 40px 12px 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 14px;
        }
        /* Clear button inside input box */
        .clear-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 18px;
            color: #888;
            cursor: pointer;
            display: none;
        }
        .clear-btn:hover {
            color: #333;
        }
        .download-btn {
            background-color: #fe2c55;
            color: white;
            border: none;
            padding: 12px 20px;
            width: 100%;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }
        .download-btn:hover {
            background-color: #e11d43;
        }
        #result {
            margin-top: 20px;
            word-break: break-all;
            font-size: 14px;
            color: #333;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>TikTok Downloader</h2>
        
        <div class="input-group">
            <input type="text" id="urlInput" placeholder="Paste TikTok link here..." oninput="toggleClearButton()">
            <button class="clear-btn" id="clearBtn" onclick="clearText()">×</button>
        </div>

        <button class="download-btn" onclick="downloadVideo()">Download</button>
        <div id="result"></div>
    </div>

    <script>
        // Show or hide clear button based on input content
        function toggleClearButton() {
            const input = document.getElementById('urlInput');
            const clearBtn = document.getElementById('clearBtn');
            if (input.value.trim().length > 0) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        }

        // Clear input text and result area instantly
        function clearText() {
            const input = document.getElementById('urlInput');
            input.value = '';
            document.getElementById('clearBtn').style.display = 'none';
            document.getElementById('result').innerHTML = '';
            input.focus();
        }

        // Process and trigger direct download
        function downloadVideo() {
            const url = document.getElementById('urlInput').value.trim();
            const resultDiv = document.getElementById('result');

            if (!url) {
                alert('Please enter a TikTok link first!');
                return;
            }

            resultDiv.innerHTML = 'Processing, please wait...';

            fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 0 && data.data) {
                        const videoUrl = data.data.play;
                        
                        resultDiv.innerHTML = `<p><b>Video is ready! Starting download...</b></p>`;

                        // Trigger browser background download directly
                        const a = document.createElement('a');
                        a.href = videoUrl;
                        a.download = 'tiktok_video.mp4';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                    } else {
                        resultDiv.innerHTML = '<span style="color:red;">Video not found. Please check the link.</span>';
                    }
                })
                .catch(error => {
                    resultDiv.innerHTML = '<span style="color:red;">Server error, please try again.</span>';
                });
        }
    </script>

</body>
</html>
