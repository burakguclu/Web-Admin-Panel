module.exports = {
    earthquake: {
        syncInterval: process.env.EARTHQUAKE_SYNC_INTERVAL || 300000, // 5 dakika (milisaniye)
        retryInterval: process.env.EARTHQUAKE_RETRY_INTERVAL || 60000, // 1 dakika (milisaniye)
        maxRetries: process.env.EARTHQUAKE_MAX_RETRIES || 3,
        dataSource: {
            url: 'http://koeri.boun.edu.tr/scripts/lst0.asp',
            encoding: 'latin1'
        }
    }
}; 