import fs from 'fs';
import path from 'path';

interface UploadResult {
  filename: string;
  blobId: string;
  url: string;
  size: number;
}

const WALRUS_PUBLISHER_URL = 'https://publisher.walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR_URL = 'https://aggregator.walrus-testnet.walrus.space';

async function uploadVideoToWalrus(filePath: string): Promise<UploadResult | null> {
  try {
    const filename = path.basename(filePath);
    console.log(`\nUploading ${filename}...`);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fileBuffer.length;
    console.log(`File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Upload to Walrus
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/blobs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Extract blob ID from response
    let blobId: string;
    if (result.newlyCreated?.blobObject) {
      blobId = result.newlyCreated.blobObject.blobId;
    } else if (result.alreadyCertified?.blobId) {
      blobId = result.alreadyCertified.blobId;
    } else if (result.blobId) {
      blobId = result.blobId;
    } else {
      throw new Error('Invalid response format');
    }

    const url = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`;
    
    console.log(`✅ Uploaded successfully!`);
    console.log(`   Blob ID: ${blobId}`);
    console.log(`   URL: ${url}`);
    
    return {
      filename,
      blobId,
      url,
      size: fileSize,
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error);
    return null;
  }
}

async function uploadAllVideos() {
  const videosToUpload = [
    '/Users/d9j9v/Code/Diego Code/Ethereum/Cannes/amply/assets/Teamm calor de toda la vida #nuevamusica #nuevoartista.mp4',
    '/Users/d9j9v/Code/Diego Code/Ethereum/Cannes/amply/assets/yaaa salió me faltas tú #nuevamusica #nuevoartista #artistaemergente.mp4',
    '/Users/d9j9v/Code/Diego Code/Ethereum/Cannes/amply/assets/Let It Be by Music Travel Love @sheridanbrass1 & @elisaastridofficial at Al Wathba Fossil Dunes .mp4',
  ];

  console.log('🚀 Starting Walrus video uploads...\n');
  
  const results: UploadResult[] = [];
  
  for (const videoPath of videosToUpload) {
    const result = await uploadVideoToWalrus(videoPath);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n📊 Upload Summary:');
  console.log('==================');
  
  if (results.length > 0) {
    console.log('\n// Add these to your home page video data:\n');
    console.log('export const walrusVideos = [');
    
    results.forEach((result, index) => {
      console.log(`  {`);
      console.log(`    id: ${index + 1},`);
      console.log(`    title: "${result.filename.replace('.mp4', '').substring(0, 50)}...",`);
      console.log(`    blobId: "${result.blobId}",`);
      console.log(`    url: "${result.url}",`);
      console.log(`    size: ${result.size},`);
      console.log(`    thumbnail: "${result.url}",`);
      console.log(`  },`);
    });
    
    console.log('];');
  }
  
  console.log(`\n✅ Successfully uploaded ${results.length}/${videosToUpload.length} videos`);
}

// Run the upload
uploadAllVideos().catch(console.error);