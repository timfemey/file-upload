import aws from "aws-sdk"
import dotenv from "dotenv"
dotenv.config()

aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
})

const s3 = new aws.S3()

const bucketName = process.env.BUCKET_NAME as string

function uploadToS3(fileName: string, fileBody: aws.S3.Body | undefined) {
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBody,
    }

    s3.upload(uploadParams, (err: any) => {
        if (err) {
            console.error('Error uploading file to S3:', err);
        }
    })
}

export { uploadToS3 }