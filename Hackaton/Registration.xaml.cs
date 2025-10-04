using Hackaton.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
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
    /// Логика взаимодействия для Registration.xaml
    /// </summary>
    public partial class Registration : Window
    {
        private ProductDbContext _context = new ProductDbContext();
        public Registration()
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

        private void Register_Click(object sender, RoutedEventArgs e)
        {
            string login = LoginBox.Text.Trim();
            string password = PasswordBox.Password;
            byte[] hashedpas = new MD5CryptoServiceProvider().ComputeHash(Encoding.UTF8.GetBytes(password));
            password = "";
            foreach (byte c in hashedpas) password += c.ToString("x2");

            if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
            {
                StatusText.Text = "Заполните все поля!";
                return;
            }

            try
            {
                if (login.Length > 50)
                {
                    StatusText.Text = "Логин слишком длинный (макс. 50 символов)";
                    return;
                }

                if (_context.Users.Any(u => u.Username == login))
                {
                    StatusText.Text = "Логин уже занят!";
                    return;
                }

                var newUser = new Users
                {
                    UserID = "USE" + Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper(),
                    Username = login,
                    PasswordHash = password,
                    Role = "User"
                };

                _context.Users.Add(newUser);
                _context.SaveChanges();

                MessageBox.Show("Регистрация успешна!");
                var authorizationWindow = new MainWindow();
                authorizationWindow.Show();

                this.Close();
            }
            catch (Exception ex)
            {
                StatusText.Text = $"Ошибка: {ex.Message}";
            }
        }
    }
}
