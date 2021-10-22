export const getUserByUsername = `
SELECT
id,
email,
username,
password,
created_at AS createdAt,
updated_at AS updatedAt
FROM users
WHERE username = :username
and is_deleted = 0
LIMIT 1;
`;

export const getUserById = `
SELECT
id,
email,
username,
password,
created_at AS createdAt,
updated_at AS updatedAt
FROM users
WHERE id = :id
and is_deleted = 0
LIMIT 1;
`;

export const insertUserQuery = `
INSERT INTO
users (username, password, created_at, updated_at, is_deleted)
VALUES (:username, :password, NOW(), NOW(), 0);
`;

export const reInsertUserQuery = `
UPDATE users
SET username = :username, password = :password, updated_at = NOW(), is_deleted = 1
WHERE id = :id
`;

export const updatePasswordQuery = `
UPDATE users
SET password = :password, updated_at = NOW()
WHERE id = :id;
`;

export const likeUserQuery = `
INSERT INTO 
likes (sender_id, receiver_id, created_at, updated_at)
VALUES (:senderId, :receiverId, NOW(), NOW())
ON DUPLICATE KEY
UPDATE id = id;
`;

export const unlikeUserQuery = `
UPDATE likes
SET is_deleted = 1
WHERE sender_id = :senderId
AND receiver_id = :receiverId;
`;

export const getUserLikesQuery = `
SELECT sender_id as senderUser
FROM likes
WHERE receiver_user = :id
`;

export const getMostLikedUsersQuery = `
SELECT l.* FROM
(SELECT u.*, (SELECT COUNT(1) FROM likes l WHERE u.id = l.receiver_id) AS likes FROM users u)
as l order by l.likes desc
`;

export const userLikesCountQuery = `
SELECT u.id, u.username,
(SELECT COUNT(1) FROM likes l
WHERE u.id = l.receiver_id) as total
FROM users u
WHERE u.id = :id
`;
