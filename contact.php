<?php
// Optional: use this only if your host runs PHP (not GitHub Pages).
// To use it, change the form's action in index.html to "contact.php".
header('Content-Type: application/json; charset=utf-8');
$to = 'knickoshfederis11@gmail.com';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok' => true]); exit; } // honeypot
$clean = fn($v) => trim(preg_replace('/[\r\n]+/', ' ', strip_tags($v ?? '')));
$name = $clean($_POST['name'] ?? ''); $email = $clean($_POST['email'] ?? '');
$type = $clean($_POST['project_type'] ?? ''); $msg = trim(strip_tags($_POST['message'] ?? ''));
if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($msg) < 10) { http_response_code(422); echo json_encode(['ok' => false]); exit; }
$body = "Name: $name\nEmail: $email\nProject type: " . ($type ?: 'n/a') . "\n\n$msg";
$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$sent = mail($to, "Portfolio message from $name", $body, "From: portfolio@$host\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8");
echo json_encode(['ok' => (bool)$sent]);