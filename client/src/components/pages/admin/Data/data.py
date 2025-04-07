import random
import json
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

# Event & Club Types
event_types = ["CULTURAL", "TECH", "EDUCATION", "SPORTS", "SEMINAR", "OTHER"]
resources_type = ["IMAGE", "VIDEO", "DOCUMENT", "URL"]
club_roles = ["Admin", "President", "Vice President", "Secretary", "Treasurer",
              "Event Coordinator", "Marketing Officer", "Content Manager",
              "Member Relations Officer", "Supporter"]
club_statuses = ["Active", "Inactive"]

# Generate College Data
def generate_college():
    return {
        "logo": fake.image_url(),
        "description": fake.text(),
        "name": fake.company(),
        "collegeCode": fake.bothify(text="???###"),
        "universityAffiliation": fake.company(),
        "ranking": random.randint(1, 100),
        "establishedYear": random.randint(1950, 2020),
        "address": {
            "street": fake.street_address(),
            "city": fake.city(),
            "state": fake.state(),
            "country": fake.country(),
            "zipCode": fake.zipcode()
        },
        "contactInfo": {
            "phoneNumber": fake.phone_number(),
            "email": fake.email(),
            "website": fake.url()
        },
        "socialLinks": {
            "linkedIn": fake.url(),
            "twitter": fake.url(),
            "facebook": fake.url(),
            "instagram": fake.url()
        },
        "studentCount": random.randint(1000, 5000),
        "facultyCount": random.randint(100, 500),
        "performanceMetrics": {
            "placementRate": round(random.uniform(60, 100), 2),
            "researchPapersPublished": random.randint(100, 1000),
            "facultyStudentRatio": round(random.uniform(1, 20), 2)
        },
        "adminDetails": {
            "createdBy": fake.name(),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
    }

# Generate Event Data
def generate_event(club_id):
    event_id = fake.uuid4()
    event_date = datetime.now() + timedelta(days=random.randint(5, 30))
    reg_deadline = event_date - timedelta(days=3)
    
    return {
        "_id": event_id,
        "title": fake.catch_phrase(),
        "eventType": random.choice(event_types),
        "description": fake.text(max_nb_chars=150),
        "eventDateTime": event_date.isoformat(),
        "location": fake.address(),
        "organizer": club_id,
        "participants": [fake.uuid4() for _ in range(random.randint(10, 50))],  # Simulated Participants
        "registrationDeadline": reg_deadline.isoformat(),
        "registrationStatus": "OPEN",
        "maxParticipants": random.randint(50, 200),
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }, event_id

# Generate Club Data
def generate_club(college_id):
    club_id = fake.uuid4()
    event_list = [generate_event(club_id) for _ in range(random.randint(5, 10))]
    event_ids = [event[1] for event in event_list]
    
    return {
        "_id": club_id,
        "clubName": fake.unique.company() + " Club",
        "shortName": fake.unique.lexify(text="CLB???"),
        "motto": fake.catch_phrase(),
        "description": fake.text(max_nb_chars=150),
        "logo": fake.image_url(),
        "socialLinks": {
            "linkedIn": fake.url(),
            "twitter": fake.url(),
            "github": fake.url(),
            "personalWebsite": fake.url()
        },
        "members": [{
            "userId": fake.uuid4(),
            "role": random.choice(club_roles),
            "joinedDate": datetime.now().isoformat()
        } for _ in range(10)],
        "followers": [fake.uuid4() for _ in range(20)],
        "facultyAdvisors": [fake.uuid4() for _ in range(2)],
        "maxMembers": 100,
        "foundingYear": random.randint(1990, 2020),
        "pastLeaders": [{
            "userId": fake.uuid4(),
            "role": random.choice(club_roles),
            "tenureStart": datetime(2020, 1, 1).isoformat(),
            "tenureEnd": datetime(2021, 1, 1).isoformat()
        }],
        "achievements": [{
            "title": fake.catch_phrase(),
            "description": fake.text(max_nb_chars=100),
            "date": (datetime.now() - timedelta(days=random.randint(50, 300))).isoformat(),
            "image": fake.image_url()
        }],
        "status": random.choice(club_statuses),
        "events": event_ids,  # Store only event IDs
        "collegeId": college_id,
        "createdBy": fake.uuid4(),
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }, event_list

# Generate Data
college = generate_college()
college_id = fake.uuid4()
clubs = []
events_by_club = {}

for _ in range(7):  # Generate 7 Clubs
    club, events = generate_club(college_id)
    clubs.append(club)
    events_by_club[club["clubName"]] = [event[0] for event in events]  # Store full event data

# Save to JSON File
college_data = {
    "college": college,
    "clubs": clubs,
    "events_by_club": events_by_club
}

with open("college_data.json", "w") as f:
    json.dump(college_data, f, indent=4)

print("✅ College Data Generated & Stored in college_data.json")
