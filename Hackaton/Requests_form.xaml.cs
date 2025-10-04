using Hackaton.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Hackaton
{
    /// <summary>
    /// Логика взаимодействия для Requests_form.xaml
    /// </summary>
    public partial class Requests_form : Window
    {
        private ProductDbContext _context = new ProductDbContext();
        public Requests_form()
        {
            InitializeComponent();
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            string[] date = datePicker.Text.Split('.');
            var newrq = new Requests()
            {
                ID = "REQ" + Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper(),
                DataTime = new DateOnly(int.Parse(date[2]), int.Parse(date[1]), int.Parse(date[0])),
                Reason = txtReason.Text,
                Resource = txtResource.Text,
                Status = "На рассмотрении",
                Login = MainWindow.login
            };

            _context.Add(newrq);
            _context.SaveChanges();

            var scrt = new Secret();
            scrt.Show();
            this.Close();
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            var scrt = new Secret();
            scrt.Show();
            this.Close();
        }
    }
}
