import psycopg2

conn = psycopg2.connect(
    dbname='uwezo_db',
    user='uwezo_user',
    password='securepassword',
    host='localhost'
)
cur = conn.cursor()

# Fetch all users
cur.execute("SELECT * FROM users;")
users = cur.fetchall()
print("Users in DB:")
for u in users:
    print(u)

# Insert a new audit entry for user_id=1
cur.execute("""
INSERT INTO audittrail (action, user_id, timestamp, details)
VALUES (%s, %s, NOW(), %s)
""", ('model_train', 1, 'Model retraining triggered by admin_user'))

conn.commit()

cur.execute("SELECT * FROM audittrail;")
print("\nAudit Trail Entries:")
for row in cur.fetchall():
    print(row)

cur.close()
conn.close()
