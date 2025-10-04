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
    /// Логика взаимодействия для Status.xaml
    /// </summary>
    public partial class Status : Window
    {
        ProductDbContext dbContext = new();
        public Status(string name)
        {
            InitializeComponent();
            SecretsGrid.ItemsSource = dbContext.Requests.Where(r => r.Resource.ToLower() == name.ToLower() && r.Login == MainWindow.login).ToList();
        }

        private void Close_CLic(object sender, RoutedEventArgs e)
        {
            var scrt = new Secret();
            scrt.Show();
            this.Close();
        }

        private void DoubleClickOnGrid(object sender, MouseButtonEventArgs e)
        {
            DataGrid dg = sender as DataGrid;
            var so = dg.SelectedItem;
            if (so.GetType().GetProperty("Status").GetValue(so).ToString() == "approved") {
                
                SecretSeeker sw = new SecretSeeker(so.GetType().GetProperty("Resource").GetValue(so).ToString());
                sw.Show();
                this.Close();
            }
        }
    }
}
