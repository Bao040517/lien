$outputDir = "C:\Users\Admin\Desktop\liennganh\uploads"
if (-not (Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$categories = @(
    @{ Name = 'cat_thoi_trang_nam.jpg'; Keywords = 'men,fashion' },
    @{ Name = 'cat_thoi_trang_nu.jpg'; Keywords = 'women,fashion' },
    @{ Name = 'cat_dien_thoai.jpg'; Keywords = 'smartphone' },
    @{ Name = 'cat_laptop.jpg'; Keywords = 'laptop' },
    @{ Name = 'cat_electronics.jpg'; Keywords = 'electronics' },
    @{ Name = 'cat_home.jpg'; Keywords = 'home,decor' },
    @{ Name = 'cat_beauty.jpg'; Keywords = 'makeup,skincare' },
    @{ Name = 'cat_baby.jpg'; Keywords = 'baby,toy' },
    @{ Name = 'cat_sports.jpg'; Keywords = 'sports,travel' },
    @{ Name = 'cat_shoes_men.jpg'; Keywords = 'shoes,men' },
    @{ Name = 'cat_shoes_women.jpg'; Keywords = 'shoes,women' },
    @{ Name = 'cat_bag.jpg'; Keywords = 'handbag' },
    @{ Name = 'cat_jewelry.jpg'; Keywords = 'jewelry' },
    @{ Name = 'cat_watch.jpg'; Keywords = 'watch' },
    @{ Name = 'cat_grocery.jpg'; Keywords = 'grocery,food' },
    @{ Name = 'cat_auto.jpg'; Keywords = 'car,motorcycle' },
    @{ Name = 'cat_book.jpg'; Keywords = 'book' },
    @{ Name = 'cat_pet.jpg'; Keywords = 'pet,dog' }
)

foreach ($cat in $categories) {
    $url = "https://loremflickr.com/320/320/" + $cat.Keywords.Replace(',', ',')
    $filepath = Join-Path $outputDir $cat.Name
    Write-Host "Downloading $($cat.Name)..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath
    } catch {
        Write-Host "Failed to download $($cat.Name): $_"
    }
}
