"""Add comment field and FK to reviews

Revision ID: 4b1f41cccd0d
Revises: 
Create Date: 2025-10-23 10:03:28.198542

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '4b1f41cccd0d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.alter_column('authenticitychecks', 'trust_score',
               existing_type=sa.REAL(),
               type_=sa.Float(),
               existing_nullable=True)
    op.alter_column('cases', 'error_rate',
               existing_type=sa.REAL(),
               type_=sa.Float(),
               existing_nullable=True)
    op.alter_column('cases', 'confidence_score',
               existing_type=sa.REAL(),
               type_=sa.Float(),
               existing_nullable=True)
    op.alter_column('decisionlabels', 'confidence',
               existing_type=sa.REAL(),
               type_=sa.Float(),
               existing_nullable=True)
    op.add_column('reviews', sa.Column('comment', sa.Text(), nullable=True))
    
    # Explicitly cast document_id from TEXT to INTEGER
    op.execute("ALTER TABLE reviews ALTER COLUMN document_id TYPE INTEGER USING document_id::integer")
    
    op.create_foreign_key(None, 'reviews', 'uploads', ['document_id'], ['id'])
    op.alter_column('users', 'username',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)
    op.alter_column('users', 'role',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)

def downgrade() -> None:
    op.alter_column('users', 'role',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
    op.alter_column('users', 'username',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
    op.drop_constraint(None, 'reviews', type_='foreignkey')
    op.alter_column('reviews', 'document_id',
               existing_type=sa.Integer(),
               type_=sa.TEXT(),
               existing_nullable=True)
    op.drop_column('reviews', 'comment')
    op.alter_column('decisionlabels', 'confidence',
               existing_type=sa.Float(),
               type_=sa.REAL(),
               existing_nullable=True)
    op.alter_column('cases', 'confidence_score',
               existing_type=sa.Float(),
               type_=sa.REAL(),
               existing_nullable=True)
    op.alter_column('cases', 'error_rate',
               existing_type=sa.Float(),
               type_=sa.REAL(),
               existing_nullable=True)
    op.alter_column('authenticitychecks', 'trust_score',
               existing_type=sa.Float(),
               type_=sa.REAL(),
               existing_nullable=True)
