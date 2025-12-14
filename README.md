# Athena - Centralized Integration Pantheon
Athena is a centralized integration pantheon designed to consume multimedia content from all types of comercial outreach platforms. We aim to generate a centralized source of information for teams all accross the B2B workflow. As part of our demo we've implemented systems that can extract and categorize data from your communications with your clients accross platforms like Linkedin, Whatsapp, Emails, Meetings, and Calls. We categorize this information and automtically generate campaigns for each of the different clients your reach out to. Then we provide a simple easy-to-use UI where you can query the information we've indexed using our state-of-the-art Rag SYSTEMS. 

___

## Directory Structure
```
.
├── 4tena-spec
├── afrontdita
├── apollo-api
├── athena-api
├── athena_backend_requests
├── hephaestus-api
├── hera-api
├── chronos-worker
├── hermes-api
├── dionysus-api
└── tartarus-api
```

Each folder in this project is named after a greek god who's mythos is relevant to the service's role and function within the project.

#### Afrontdita
Afrontdita is our frontend where the users will interact with our full system. It's designed in react with tailwind. It's meant to be the face of our project.

#### Athena
Athena is our goddess of wisdom and the one responsible in orchestrating the RAG queries. Athena is the mainbackend to our frontend and it's meant to be the heart of our project. This service recieves user queries and builds complex RAG responses to these queries by composing information saved accross our vector databases and mongo databases.

#### Hera
Hera, like Athena is our goddess of family and it's in charge of determining the merchant to which each piece of intake information corresponds. Using our vector databases we use a semi supervised model to infer the corresponding merchant to our intake information. The more you use our system the better it gets!

#### Hermes
Hermes, the god of messengers is in charge of orchestrating the ratification of our systems accross the vector databases and mongo databases. It recieves the confirmed merchants for a specific piece of information and saves it in our databases for further inference and RAG.

#### Apollo
Apollo god of prophecy helps in intaking the corresponding information from our multiple platforms (Linkedin, Whatsapp, Emails. Meetings, and Calls). His prophesizing powers allow us to recieve information previously lost in communication.

#### Hephaestus
Hephaestus god of blacksmiths is in charge of fixing and ratifying the corresponding information recieved from the user once they confirm that a merchant corresponds to a certain piece of communication or not. He builds our final data model in mongo and asks Hermes to coordinate the ratification of this information accross vector databases.

#### Cronos
Cronos titan of time recieves information from Apollo and carefully controls it's timing to launch it towards our other services in order to be indexed and saved in our databases. Cronos saves our information in temporary non ratified storage on our MongoDB and finally tells Hera to predict the merchant ids corresponding to the info.

#### Tartarus
A dark god we don't talk about. To behold his code is to risk insanity. To open his files is to delve into regret.

#### Dionysus
The god of irony and fun. A last ditch attempt at a hail marry.

___

### Infrastructure
*   **Milvus**: Vector Database (v2.6.7) running on port 19530. Used for storing embeddings of merchant data.
*   **NATS**: Messaging System (v2.12.2) running on ports 4222/8222. Used for inter-service communication.
*   **Docker Compose**: Orchestrates the entire backend ecosystem (`compose.yml`).

## Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js (for frontend/integration-api)
*   Python 3.10+ (for python services)

### Running the System

1.  **Start Backend**:
    ```bash
    docker compose up -d
    ```

2.  **Start Frontend (afrontdita)**:
    ```bash
    cd afrontdita
    npm install
    npm run dev
    ```
