# Question Rotation System

A NestJS application designed to assign questions dynamically based on user regions and cycles. The system is capable of handling a large number of users, ensuring efficient question assignments and caching.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Caching](#caching)
- [Scheduler](#scheduler)
- [System Design Overview](#system-design-overview)
- [Architecture Diagram](#architecture-diagram)
- [Implementation Steps](#implementation-steps)
- [Scalability Considerations](#scalability-considerations)
- [Pros and Cons](#pros-and-cons)

## Features

- Dynamic question assignment based on user region and cycle.
- Configurable cycle duration (default set to 1 week).
- Efficient caching using NestJS Cache Manager.
- Scheduled updates for question assignments.
- Easy to scale for high user load.

## Technologies Used

- **Node.js**: Runtime environment.
- **NestJS**: Framework for building scalable server-side applications.
- **TypeORM**: ORM for database interactions.
- **PostgreSQL**: Database for storing questions and assignments.
- **Cache Manager**: Caching layer to improve performance.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/edwinedjokpa/question-rotation-system.git
cd question-rotation-system
```

### 2. Install Dependencies

npm install

### 3. Configure the Environment

Create a .env file in the root directory and configure your database connection:

- **DB_HOST**=your_database_host
- **DB_DATABASE**=your_database
- **DB_USER**=your_database_user

- **DB_PORT**=your_database_port
- **DB_PASSWORD**=your_database_user_password
- **CYCLE_START_DATE**=cycle_start_date(e.g: 2024-10-05)
- **CYCLE_DURATION**=cycle_duration(e.g: 7)

## Configuration

Cache Configuration

- You can configure the caching behavior in the app.module.ts:

```javascript
CacheModule.register({
  ttl: 3600, // Cache duration in seconds
  max: 100, // Maximum number of items in cache
});
```

## Usage

To start the application, use the following command:

npm run start:dev

url: http://localhost:3000

## API Endpoints

- Create a New Question

**POST** /api/questions

Request Body

```json
{
  "region": "SG",
  "text": "What is your favorite programming language?",
  "assignedCycle": 1
}
```

- Get Assigned Question

**GET** /api/questions?region=SG

Query Parameters

- region: The region of the user.

**Update Assignments**

- Automatically handled by the scheduler every Monday at 7 PM SGT. The assignments will be updated based on the current cycle and cached accordingly.

## Caching

The application uses NestJS Cache Manager for caching question assignments. Caching improves performance by reducing database load for repeated requests.

- Cached entries expire after 1 hour by default but can be configured in the code.

## Scheduler

The question assignments are updated automatically using a scheduled task that runs every Monday at 7 PM SGT. The current cycle is calculated based on a predefined start date.

## System Design Overview

The question rotation system is designed to dynamically assign questions based on user regions and cycles. The core components include:

1. **Question Repository:** Manages question data and relationships in the database.

2. **Service Layer:** Contains business logic for fetching and assigning questions.

3. **Scheduler:** Responsible for updating assignments at specified intervals.

4. **Cache Layer:** Enhances performance by reducing the number of database queries for frequently accessed data.

## Architecture Diagram

```
+-----------------+
|   User Device   |
+-----------------+
|
v
+-----------------+
|     API Layer   |    <-- Load Balancer -->
+-----------------+
|
v
+-----------------+
|   Application   |
| (Business Logic)|
+-----------------+
|
v
+-----------------+
|     Database     |
| (Questions Table)|
+-----------------+
|
v
+-----------------+
|    Scheduler    |
| (Cycle Manager) |
+-----------------+
|
v
+-----------------+
|     Cache       |
| (Cache Manager) |
+-----------------+
```

## Implementation Steps

- **Set Up NestJS Project:** Initialize a new NestJS project and install necessary dependencies.

- **Define Entities:** Create the Question entity and any related entities for the database.

- **Implement Services:** Develop the QuestionsService to handle business logic.

- **Create Controller:** Implement API endpoints to manage question creation and retrieval.

- **Implement Caching:** Use NestJS Cache Manager to cache question assignments.

- **Set Up Scheduler:** Implement a cron job to update question assignments weekly.

## Scalability Considerations

1. **Database Scaling:** Use connection pooling and consider database sharding for large datasets.

2. **Caching Strategy:** Optimize cache hit ratios by adjusting TTL values and using appropriate cache keys.

3. **Load Balancing:** Distribute incoming traffic across multiple application instances.

4. **Horizontal Scaling:** Scale out by deploying multiple instances of the application.

## Pros and Cons

### Pros

- **Dynamic Assignment:** Automatically assigns questions based on user region and cycle.

- **Efficient Caching:** Reduces database load and improves response times.

- **Scalable Architecture:** Designed to handle high user loads efficiently.

### Cons

- **Complexity:** The system's complexity can increase with the addition of more features or regions.

- **Cache Invalidation:** Managing cache consistency can be challenging, especially with frequent updates.
