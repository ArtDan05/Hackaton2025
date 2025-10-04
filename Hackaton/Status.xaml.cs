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
        public Status()
        {
            InitializeComponent();
        }

        private void Close_CLic(object sender, RoutedEventArgs e)
        {
            var scrt = new Secret();
            scrt.Show();
            this.Close();
        }
    }
}
