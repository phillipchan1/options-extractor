import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
const containerName = "trade-screenshots";

async function uploadToAzureBlob(imageBuffer: Buffer, fileName: string): Promise<string> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'blob' }); // Set container to allow public access to blobs

    const blobName = `${Date.now()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(imageBuffer, imageBuffer.length);
    await blockBlobClient.setHTTPHeaders({ blobContentType: 'image/png' }); // Set correct content type

    return blockBlobClient.url;
}

export { uploadToAzureBlob }