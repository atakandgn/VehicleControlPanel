# Vehicle Control Panel

Vehicle Control Panel, araç ayarlarının yönetimi ve kullanıcıların araçlarına dair çeşitli bilgileri görüntüleyebilmeleri için tasarlanmış bir uygulamadır. Kullanıcılar, far ayarlarını, sis farı ayarlarını ve araçlarının navigasyon verilerini yönetebilirler.

## Özellikler

- Kullanıcı kaydı ve girişi
- Far ve sis farı ayarlarını yönetme
- Araç navigasyon verilerini kaydetme ve görüntüleme
- Kullanıcı ve admin rolleri

## Başlarken

Bu talimatlar, yerel makinenizde projeyi çalıştırmak için gerekli adımları sağlayacaktır.

### Gereksinimler

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js ve npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Kurulum

1. **Backend**:
   - Proje dizinine gidin ve gerekli bağımlılıkları yükleyin.
     ```bash
     cd backend
     dotnet restore
     ```
   - Veritabanını ayarlayın.
     ```bash
     dotnet ef migrations add UpdateAllModels
     dotnet ef database update
     ```
   - Uygulamayı çalıştırın.
     ```bash
     dotnet watch run
     ```

2. **Frontend**:
   - Proje dizinine gidin ve gerekli bağımlılıkları yükleyin.
     ```bash
     cd frontend
     npm install
     ```
   - Çevresel değişkenleri ayarlayın:
     ```bash
     cp .env.example .env
     ```
   - Uygulamayı çalıştırın.
     ```bash
     npm start
     ```

### Admin Hesabı

Admin hesabı bilgileri:

- **Email**: admin@bozankaya.com
- **Şifre**: adminbozankaya

## Kullanım

### API Endpoints

- **Kullanıcı Kaydı**: `POST /users/register`
- **Kullanıcı Girişi**: `POST /users/login`
- **Kullanıcı Araç Ayarlarını Getirme**: `GET /VehicleSettings/GetUserVehicleSettings`
- **Kullanıcı Araç Ayarlarını Güncelleme**: `PUT /VehicleSettings/UpdateVehicleSettings`
- **Sis Farlarını Ekleme**: `POST /VehicleSettings/AddFoglights`
- **Farları Ekleme**: `POST /VehicleSettings/AddHeadlights`
- **Farları Güncelleme**: `PUT /VehicleSettings/UpdateHeadlights`
- **Menü Başlıklarını Getirme**: `GET /VehicleSettings/GetSettingsTitles`
- **Far Verilerini Getirme**: `GET /VehicleSettings/GetHeadlightsData`
- **Sis Far Verilerini Getirme**: `GET /VehicleSettings/GetFoglightsData`
- **Navigasyon Verilerini Kaydetme**: `POST /VehicleSettings/SaveNavigation`

### Frontend Kullanımı

- **Far Ayarları**: Kullanıcı, farları seçip güncelleyebilir.
- **Sis Farı Ayarları**: Ön ve arka sis farlarını açıp kapatabilir.
- **Yolculuk Verileri**: Kullanıcı yolculuk verilerini kaydedebilir ve yönetebilir.


## İletişim

Proje ile ilgili herhangi bir sorunuz varsa, lütfen bize ulaşın:

- **Email**: [atakandogan.info@gmail.com](mailto:atakandogan.info@gmail.com)