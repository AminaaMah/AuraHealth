<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#contact');
    exit;
}

if (!empty($_POST['website'])) {
    header('Location: message-sent.html');
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$errors = [];

if ($name === '' || mb_strlen($name) > 100) {
    $errors[] = 'Please enter your name (up to 100 characters).';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
    $errors[] = 'Please enter a valid email address.';
}

if ($message === '' || mb_strlen($message) > 2000) {
    $errors[] = 'Please enter a message (up to 2000 characters).';
}

if ($errors) {
    http_response_code(422);
    renderError($errors);
    exit;
}

$configFile = __DIR__ . '/config.php';

if (!is_file($configFile)) {
    error_log('Aura Health: config.php is missing. Copy config.example.php to config.php.');
    http_response_code(500);
    renderError(['The contact form is temporarily unavailable. Please try again later.']);
    exit;
}

$config = require $configFile;

try {
    $pdo = new PDO($config['dsn'], $config['user'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $statement = $pdo->prepare(
        'INSERT INTO contact_messages (name, email, message) VALUES (:name, :email, :message)'
    );

    $statement->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message,
    ]);
} catch (PDOException $exception) {
    error_log('Aura Health: ' . $exception->getMessage());
    http_response_code(500);
    renderError(['Your message could not be sent. Please try again later.']);
    exit;
}

header('Location: message-sent.html');
exit;

function renderError(array $errors): void
{
    $items = '';
    foreach ($errors as $error) {
        $items .= '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
    }

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message not sent – Aura Health</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="container">
        <div class="message-box">
            <h1>Message not sent</h1>
            <ul>{$items}</ul>
            <a class="button button-primary" href="index.html#contact">Back to the form</a>
        </div>
    </main>
</body>
</html>
HTML;
}
