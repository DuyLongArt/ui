// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//     endpoint: "http://192.168.22.4:9000",
//     region: "us-east-1",
//     credentials: {
//         accessKeyId: "duylongadmin",
//         secretKeyId: "duylongadminpass",
//     },
//     forcePathStyle: true, // Crucial for MinIO to use http://host:port/bucket instead of http://bucket.host:port
// });

// const uploadImage = async (fileData: File, bucket: string, fileName: string) => {
//     try {
//         // In the browser, we use arrayBuffer() directly
//         const arrayBuffer = await fileData.arrayBuffer();

//         const command = new PutObjectCommand({
//             Bucket: bucket,
//             Key: fileName,
//             Body: new Uint8Array(arrayBuffer),
//             ContentType: fileData.type, // Ensures the browser sees it as an image, not a download
//         });

//         await s3Client.send(command);

//         // Construct the public URL
//         const url = `http://192.168.22.4:9000/${bucket}/${fileName}`;
//         console.log('✅ Upload successful!');
//         return { url };
//     } catch (err) {
//         console.error('❌ Error uploading:', err);
//         throw err;
//     }
// }

// export default uploadImage;