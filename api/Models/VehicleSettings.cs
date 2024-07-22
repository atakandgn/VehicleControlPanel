namespace VehicleControlPanel.Models
{
    public class VehicleSettings
    {
        public int Id { get; set; }
        public int HeadlightsId { get; set; } // Foreign Key to Headlights table
        public Headlights Headlights { get; set; } // Navigation Property
        public List<int> Foglights { get; set; } // Changed to List<int> first for front fog 0-1 , second 0,1 for back fog 
        public int HeadlightAngle { get; set; } // 0-100 degrees
    }
}
