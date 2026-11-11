এই বিল্ডে অডিও বন্ধ (audio.enabled = false)।
পরে নেরেশন যোগ করতে: narration.mp3 এই ফোল্ডারে রাখুন, তারপর episode.config.json-এ
"audio": { "enabled": true, "src": "audio/narration.mp3", "volume": 1, "offsetSeconds": 0 } করুন।
SRT টাইমিং অডিওর সাথে মিলিয়ে তৈরি; offsetSeconds দিয়ে সিঙ্ক ঠিক করা যাবে।
