const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = 'C:/Users/Admin/Desktop/liennganh/uploads';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Using placehold.co for reliable placeholder images with text, simulating "real" product categories visually
// In a real scenario, we'd use Unsplash API or similar, but for this environment, generating reliable unique images is key.
// Let's use a service that generates colored placeholders with text to differentiate.
// Wait, the user asked for "real images". I can't generate AI images directly to disk easily without a tool. 
// I will use `generate_image` tool for a few key ones or use a reliable placeholder service that offers "real"-looking random images.
// Actually, I can use https://picsum.photos/200/200?random=1 etc.
// Let's use specific keywords with unsplash source if possible, or just distinct random images.

const categories = [
    { name: 'Thời trang nam', file: 'cat_thoi_trang_nam.jpg', keywords: 'men,fashion' },
    { name: 'Thời trang nữ', file: 'cat_thoi_trang_nu.jpg', keywords: 'women,fashion' },
    { name: 'Điện thoại & Phụ kiện', file: 'cat_dien_thoai.jpg', keywords: 'smartphone' },
    { name: 'Máy tính & Laptop', file: 'cat_laptop.jpg', keywords: 'laptop' },
    { name: 'Thiết bị điện tử', file: 'cat_electronics.jpg', keywords: 'electronics' },
    { name: 'Nhà cửa & Đời sống', file: 'cat_home.jpg', keywords: 'home,decor' },
    { name: 'Sức khỏe & Làm đẹp', file: 'cat_beauty.jpg', keywords: 'makeup,skincare' },
    { name: 'Mẹ & Bé', file: 'cat_baby.jpg', keywords: 'baby,toy' },
    { name: 'Thể thao & Du lịch', file: 'cat_sports.jpg', keywords: 'sports,travel' },
    { name: 'Giày dép nam', file: 'cat_shoes_men.jpg', keywords: 'shoes,men' },
    { name: 'Giày dép nữ', file: 'cat_shoes_women.jpg', keywords: 'shoes,women' },
    { name: 'Túi ví nữ', file: 'cat_bag.jpg', keywords: 'handbag' },
    { name: 'Phụ kiện & Trang sức', file: 'cat_jewelry.jpg', keywords: 'jewelry' },
    { name: 'Đồng hồ', file: 'cat_watch.jpg', keywords: 'watch' },
    { name: 'Bách hóa online', file: 'cat_grocery.jpg', keywords: 'grocery,food' },
    { name: 'Ô tô & Xe máy', file: 'cat_auto.jpg', keywords: 'car,motorcycle' },
    { name: 'Nhà sách online', file: 'cat_book.jpg', keywords: 'book' },
    { name: 'Thú cưng', file: 'cat_pet.jpg', keywords: 'pet,dog' },
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filepath}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const run = async () => {
    for (const cat of categories) {
        // Using loremflickr for keyword-based images which is better than random picsum
        const url = `https://loremflickr.com/320/320/${cat.keywords.replace(/,/g, ',')}`;
        const filepath = path.join(outputDir, cat.file);
        try {
            await downloadImage(url, filepath);
        } catch (e) {
            console.error(`Failed to download ${cat.file}:`, e);
        }
    }
};

run();
