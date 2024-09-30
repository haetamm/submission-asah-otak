CREATE TABLE master_kata (
    id INT(11),
    kata VARCHAR(255),
    clue VARCHAR(255)
);

INSERT INTO master_kata VALUES 
    (1, "Kulkas", "Aku dingin dan menjaga makananmu tetap segar."),
    (2, "Televisi", "Aku media hiburan yang menayangkan berbagai acara dan film."),
    (3, "Sepatu", "Aku melindungi kakimu saat berjalan dan berlari."),
    (4, "Kamera", "Aku menangkap momen berharga dan menyimpannya dalam bentuk gambar."),
    (5, "Cangkir", "Aku tempat minum yang sering digunakan untuk menyajikan kopi atau teh."),
    (6, "Lampu", "Aku memberikan cahaya untuk menerangi ruanganmu."),
    (7, "Sepeda", "Aku kendaraan yang memiliki dua roda dan membantumu bergerak "),
    (8, "Penggaris", "Aku alat yang membantumu mengukur panjang dan menggambar garis lurus."),
    (9, "Tikar", "Aku sering digunakan sebagai alas duduk di lantai, terutama saat berkumpul di luar atau di dalam rumah."),
    (10, "Teko", "Aku digunakan untuk menyeduh dan menyajikan minuman panas seperti teh atau kopi.");
    


CREATE TABLE point_game (
    id_point INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nama_user VARCHAR(255),
    total_point INT(20)
);