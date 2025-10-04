using System;
using Hackaton.Data;
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
using System.Windows.Automation.Peers;

namespace Hackaton
{
    /// <summary>
    /// Логика взаимодействия для NewSecret.xaml
    /// </summary>
    public partial class NewSecret : Window
    {
        private ProductDbContext _context = new();
        public NewSecret()
        {
            InitializeComponent();

            try
            {
                _context = new ProductDbContext();

                _context.Database.EnsureCreated();

                bool canConnect = _context.Database.CanConnect();
                if (!canConnect)
                {
                    MessageBox.Show("Не удалось создать базу данных");
                }
            }

            catch (Exception ex)
            {
                MessageBox.Show($"Ошибка инициализации БД: {ex.Message}");
            }
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            if (txtFullName.Text != "" &&
                txtLogin.Text != "" &&
                txtPassword.Text != "" &&
                txtHost.Text != "" &&
                txtDescription.Text != "") 
            {
                Secrets s = new Secrets()
                {
                    ID = "SEC" + Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper(),
                    Name = txtFullName.Text,
                    LoginEncrypted = PasswordHasher.HashPassword(txtLogin.Text),
                    PasswordEncrypted = PasswordHasher.HashPassword(txtPassword.Text),
                    Host = txtHost.Text,
                    CreatedAt = DateTime.Now,
                    Description = txtDescription.Text
                };

                _context.Secrets.Add(s);
                _context.SaveChanges();

                var scrt = new Secret();
                scrt.Show();

                this.Close();
            }

            else
            {
                if (txtFullName.Text == "")
                    txtFullName.Text = "ЗАПОЛНИТЕ ЭТО ПОЛЕ!";
                if (txtLogin.Text == "")
                    txtLogin.Text = "ЗАПОЛНИТЕ ЭТО ПОЛЕ!";
                if (txtPassword.Text == "")
                    txtPassword.Text = "ЗАПОЛНИТЕ ЭТО ПОЛЕ!";
                if (txtHost.Text == "")
                    txtHost.Text = "ЗАПОЛНИТЕ ЭТО ПОЛЕ!";
                if (txtDescription.Text == "")
                    txtDescription.Text = "ЗАПОЛНИТЕ ЭТО ПОЛЕ!";
            }
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            var scrt = new Secret();
            scrt.Show();
            this.Close();
        }
    }
}
