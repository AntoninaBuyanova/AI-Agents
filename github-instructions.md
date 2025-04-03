# Инструкция по отправке кода в GitHub

## 1. Создание репозитория

1. Перейдите на GitHub: https://github.com/new
2. Создайте новый репозиторий (без README, .gitignore и лицензии)
3. Дайте ему имя, например "Best-Answer"

## 2. Настройка локального репозитория

После создания репозитория, выполните следующие команды в терминале:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя GitHub)
git remote add origin https://github.com/YOUR_USERNAME/Best-Answer.git

# Отправьте код в репозиторий
git push -u origin main
```

## 3. Аутентификация

Если вы используете GitHub с аутентификацией по токену:

1. Создайте персональный токен доступа (PAT) на странице: https://github.com/settings/tokens
2. При запросе учетных данных используйте токен вместо пароля

## 4. Альтернативный способ: использование SSH

Если вы предпочитаете использовать SSH вместо HTTPS:

```bash
# Добавьте удаленный репозиторий по SSH
git remote add origin git@github.com:YOUR_USERNAME/Best-Answer.git

# Отправьте код
git push -u origin main
```

Для настройки SSH ключей следуйте инструкции: https://docs.github.com/en/authentication/connecting-to-github-with-ssh 