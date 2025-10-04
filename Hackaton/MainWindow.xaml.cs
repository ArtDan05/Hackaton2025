using Hackaton.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Hackaton
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        ProductDbContext db = new ProductDbContext();
        public static string login;
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Register_Click(object sender, RoutedEventArgs e)
        {
            var registrationWindow = new Registration();
            registrationWindow.Show();

            this.Close();
        }

        private void Login_Click(object sender, RoutedEventArgs e)
        {
            login = LoginBox.Text.Trim();
            string password = PasswordBox.Password;

            if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
            {
                StatusText.Text = "Введите логин и пароль!";
                return;
            }

            try
            {
                var user = db.Users.AsNoTracking().FirstOrDefault(u => u.Username == login);

                if (user == null)
                {
                    StatusText.Text = "Пользователь не найден!";
                    return;
                }

                if (PasswordHasher.VerifyPassword(password, user.PasswordHash))
                {
                    new Secret().Show();
                    this.Close();
                }
                else
                {
                    StatusText.Text = "Неверный пароль!";
                }
            }
            catch (Exception ex)
            {
                StatusText.Text = $"Ошибка: {ex.Message}";
                Debug.WriteLine(ex.ToString());
            }
        }
    }
}