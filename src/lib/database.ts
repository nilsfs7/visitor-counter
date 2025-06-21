import { DataSource } from 'typeorm';
import { VisitEntity } from './entities/visit.entity';
import { ProjectEntity } from './entities/project.entity';
import mysql from 'mysql2/promise';
import 'reflect-metadata';

// Database configuration
const dbConfig = {
  type: (process.env.DB_TYPE as 'mysql') || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'visitor_counter',
  ssl: JSON.parse(process.env.DB_SSL_OPTIONS || '{ "rejectUnauthorized": false }'),
};

// Create database if it doesn't exist
export async function createDatabaseIfNotExists() {
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      ssl: dbConfig.ssl,
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.info(`Database '${dbConfig.database}' is ready`);

    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Create DataSource
export const AppDataSource = new DataSource({
  ...dbConfig,
  synchronize: true, // Auto-create tables (use false in production)
  logging: process.env.NODE_ENV === 'development',
  entities: [VisitEntity, ProjectEntity],
  subscribers: [],
  migrations: [],
});

// Initialize database connection
export async function initializeDatabase() {
  try {
    // Initialize the TypeORM connection
    await AppDataSource.initialize();
    console.info('Database connection established successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Get repository for VisitorData
export function getVisitRepository() {
  return AppDataSource.getRepository(VisitEntity);
}

export function getProjectRepository() {
  return AppDataSource.getRepository(ProjectEntity);
}

// Global initialization flag
let isInitialized = false;

// Safe initialization function
export async function ensureDatabaseInitialized() {
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
}
