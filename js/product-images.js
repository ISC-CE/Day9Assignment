// Function to generate a GUID for product ID
// Configure the AWS SDK with your credentials (Not recommended for security)
AWS.config.update({
    accessKeyId: 'YOUR_KEY',
    secretAccessKey: 'YOUR_SECRET',
    region: 'us-east-1'
});

function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to handle the form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Get the product details from the form
    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').files[0];

    // Generate a GUID for the product ID
    const productId = generateGUID();

    // Upload the image to S3
    uploadImageToS3(productId, productImage, function(err, imageUrl) {
        if (err) {
            console.error('Error uploading image:', err);
            return;
        }

        // Add the product to the table
        addProductToTable(productId, productName, imageUrl);
    });
}

function uploadImageToS3(productId, imageFile, callback) {
    const s3 = new AWS.S3(); // Initialize S3 without the require statement

    const params = {
        Bucket: 'YOUR_BUCKET',
        Key: `${productId}/${imageFile.name}`,
        Body: imageFile,
        ACL: 'public-read' // Make the image publicly accessible
    };


    s3.putObject(params, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        // Return the public URL of the uploaded image
        const imageUrl = `https://s3.amazonaws.com/${params.Bucket}/${params.Key}`;
        callback(null, imageUrl);
    });
}

// Function to add a product to the table
function addProductToTable(productId, productName, imageUrl) {
    const table = document.getElementById('productsTable');
    const newRow = table.insertRow();

    const nameCell = newRow.insertCell(0);
    nameCell.textContent = productName;

    const imageCell = newRow.insertCell(1);
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.alt = productName;
    imageElement.width = 100; // Set a fixed width for the image
    imageCell.appendChild(imageElement);
}


// Attach the form submit handler after the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
});
