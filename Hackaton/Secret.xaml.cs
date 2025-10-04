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
    /// Логика взаимодействия для Secret.xaml
    /// </summary>
    public partial class Secret : Window
    {
        ProductDbContext dbContext;
        public Secret()
        {
            
            InitializeComponent();

           
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            var search = SearchTextBox.Text.ToLower();
            SecretsGrid.ItemsSource = dbContext.Secrets
                .Where(s => s.Name.ToLower().Contains(search) ||
                           s.Host.ToLower().Contains(search))
                .ToList();
        }

        private void AddSecretBtn_Click(object sender, RoutedEventArgs e)
        {
            var nwscrt = new NewSecret();
            nwscrt.Show();
            this.Close();
        }

        private void RequestAccessBtn_Click(object sender, RoutedEventArgs e)
        {

        }

        private void SecretsGrid_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
    }
}
