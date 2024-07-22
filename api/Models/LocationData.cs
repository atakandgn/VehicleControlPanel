namespace VehicleControlPanel.Models
{
    public class LocationData
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public float StartLatitude { get; set; }
        public float StartLongitude { get; set; }
        public float EndLatitude { get; set; }
        public float EndLongitude { get; set; }
    }
}
