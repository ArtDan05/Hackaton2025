using Hackaton.Data;
using Microsoft.EntityFrameworkCore;
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
    /// Логика взаимодействия для SecretSeeker.xaml
    /// </summary>
    public partial class SecretSeeker : Window
    {
        ProductDbContext dbContext = new();
        public SecretSeeker(string name)
        {
            InitializeComponent();
            DesciptionText.Text = dbContext.Secrets.Where(r => r.Name.ToLower() == name.ToLower() && r.LoginEncrypted == MainWindow.login).ToList()[0].Description;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Secret swin = new();
            swin.Show();
            this.Close();
        }
    }
}
