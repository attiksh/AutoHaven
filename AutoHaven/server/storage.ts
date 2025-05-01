import { 
  users, type User, type InsertUser,
  cars, type Car, type InsertCar,
  messages, type Message, type InsertMessage,
  reviews, type Review, type InsertReview,
  favorites, type Favorite, type InsertFavorite,
  conditionEnum, fuelTypeEnum, transmissionEnum
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Car operations
  getCar(id: number): Promise<Car | undefined>;
  getCars(filters?: Partial<Car>): Promise<Car[]>;
  getUserCars(userId: number): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, carData: Partial<Car>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(userId1: number, userId2: number, carId?: number): Promise<Message[]>;
  getUserMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getCarReviews(carId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Favorite operations
  getFavorite(id: number): Promise<Favorite | undefined>;
  getUserFavorites(userId: number): Promise<Favorite[]>;
  isFavorite(userId: number, carId: number): Promise<boolean>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(userId: number, carId: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  private favorites: Map<number, Favorite>;
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private carIdCounter: number;
  private messageIdCounter: number;
  private reviewIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    
    this.userIdCounter = 1;
    this.carIdCounter = 1;
    this.messageIdCounter = 1;
    this.reviewIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private async initializeSampleData() {
    // Create sample seller user
    const seller = await this.createUser({
      username: "carseller",
      password: "password123",
      email: "seller@automarket.com",
      name: "Auto Marketplace"
    });
    
    // Sample car data
    const carData = [
      {
        title: "2020 Toyota Camry XSE - Low Miles, Like New",
        make: "Toyota",
        model: "Camry",
        year: 2020,
        price: 25999,
        mileage: 15420,
        condition: "like_new",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Beautiful 2020 Toyota Camry XSE with low miles. This car is in excellent condition inside and out. Features include leather seats, sunroof, and Toyota Safety Sense package.",
        features: ["Leather Seats", "Navigation", "Bluetooth", "Backup Camera", "Sunroof", "Heated Seats"],
        location: "San Francisco, CA",
        images: ["https://dealerimages.dealereprocess.com/image/upload/1841003.jpg", "https://www.cnet.com/a/img/resize/2cf1820d218d69c71ad3000467b0080501a339c8/hub/2018/11/16/2eb60b0f-8d78-4f92-8ec9-2b4e3ac782c9/toyota-camry-trd-ogi.jpg?auto=webp&fit=crop&height=675&width=1200"],
        userId: seller.id
      },
      {
        title: "2018 Tesla Model 3 Long Range - Full Self Driving",
        make: "Tesla",
        model: "Model 3",
        year: 2018,
        price: 41995,
        mileage: 31000,
        condition: "excellent",
        fuel: "electric",
        transmission: "automatic",
        description: "Long Range Tesla Model 3 with Full Self Driving capability. Single owner, always garaged, and regularly maintained. White exterior with black interior.",
        features: ["Full Self Driving", "Premium Interior", "Heated Seats", "Premium Audio", "Glass Roof"],
        location: "Austin, TX",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-jQMqMxxF9RI0BbPNK8T64BQ1gWA_8GD3WQ&s"],
        userId: seller.id
      },
      {
        title: "2019 Honda Civic Sport - Turbocharged Engine",
        make: "Honda",
        model: "Civic",
        year: 2019,
        price: 19750,
        mileage: 28500,
        condition: "good",
        fuel: "gasoline",
        transmission: "manual",
        description: "Sporty Honda Civic with manual transmission and turbocharged engine. Perfect for those who enjoy driving. Well maintained with service records available.",
        features: ["Sport Mode", "Apple CarPlay", "Android Auto", "Turbocharged Engine", "Sport Wheels"],
        location: "Chicago, IL",
        images: ["https://www.cnet.com/a/img/resize/5ad5ba0e3b30db7b737df5b99ef6096791fd133f/hub/2019/05/20/206ebe75-ceca-4a48-85f9-0ee77584d676/2019-honda-civic-touring-sedan-ogi-1.jpg?auto=webp&fit=crop&height=675&width=1200"],
        userId: seller.id
      },
      {
        title: "2021 Ford F-150 Lariat - 4x4, Crew Cab",
        make: "Ford",
        model: "F-150",
        year: 2021,
        price: 52990,
        mileage: 8700,
        condition: "like_new",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Almost new Ford F-150 Lariat with all the bells and whistles. Features include 4x4, crew cab, leather interior, navigation, and Pro Trailer Backup Assist.",
        features: ["4x4", "Leather Interior", "Navigation", "Crew Cab", "Trailer Backup Assist", "Heated Seats"],
        location: "Dallas, TX",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Rku0jyxZMBxVvcog0N8YdVd_oRJ17pLdBA&s", "https://pictures.dealer.com/k/koonsannapolisfordfd/1489/a8148a6593adea6aec44d2f8a042aa7bx.jpg?impolicy=resize&w=568"],
        userId: seller.id
      },
      {
        title: "2017 BMW X5 xDrive35i - Luxury SUV",
        make: "BMW",
        model: "X5",
        year: 2017,
        price: 34500,
        mileage: 42000,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Luxurious BMW X5 with xDrive all-wheel drive. Features include panoramic sunroof, heated leather seats, navigation, and premium sound system.",
        features: ["All-Wheel Drive", "Panoramic Sunroof", "Heated Seats", "Navigation", "Premium Sound"],
        location: "Miami, FL",
        images: ["https://pictures.dealer.com/b/bmwofsanantonio/1978/afcc0d86cfc58b0060cad81adec1cb5fx.jpg", "https://cdn.motor1.com/images/mgl/03EGz/s1/bmw-x5.webp", "https://www.taylorbmw.com/assets/shared/CustomHTMLFiles/Compliance/BMW/FMA/images/2017-X5-xDrive35i.png"],
        userId: seller.id
      },
      {
        title: "2020 Mazda CX-5 Grand Touring - AWD Crossover",
        make: "Mazda",
        model: "CX-5",
        year: 2020,
        price: 28750,
        mileage: 19800,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Beautiful Mazda CX-5 in Soul Red Crystal Metallic. This Grand Touring model comes with all-wheel drive, leather seats, Bose sound system, and more.",
        features: ["All-Wheel Drive", "Leather Seats", "Bose Sound System", "Sunroof", "Heated Seats"],
        location: "Seattle, WA",
        images: ["https://cka-dash.s3.amazonaws.com/001-0120-WMA1202/model1.png"],
        userId: seller.id
      },
      {
        title: "2016 Chevrolet Silverado 1500 LT - 4x4, Crew Cab",
        make: "Chevrolet",
        model: "Silverado 1500",
        year: 2016,
        price: 27990,
        mileage: 58000,
        condition: "good",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Reliable Chevrolet Silverado with 4x4 capability. This truck has been well maintained and is ready for work or play.",
        features: ["4x4", "Tow Package", "Crew Cab", "Backup Camera", "Bluetooth"],
        location: "Denver, CO",
        images: ["https://www.speednik.com/files/2016/02/2016-02-15_18-58-13.jpg"],
        userId: seller.id
      },
      {
        title: "2022 Hyundai Tucson Limited - Hybrid SUV",
        make: "Hyundai",
        model: "Tucson",
        year: 2022,
        price: 33995,
        mileage: 5200,
        condition: "new",
        fuel: "hybrid",
        transmission: "automatic",
        description: "Nearly new Hyundai Tucson Hybrid Limited with all the latest features. This eco-friendly SUV delivers impressive fuel economy without sacrificing performance.",
        features: ["Hybrid Powertrain", "Panoramic Sunroof", "360-degree Camera", "Leather Seats", "10.25-inch Touchscreen"],
        location: "Portland, OR",
        images: ["https://www.wallacehyundaiofstuart.com/blogs/3105/wp-content/uploads/2021/07/2022-hyundai-tucson-near-stuart-fl.jpg", "https://www.cnet.com/a/img/resize/fbb2c960e0cdee623135232f82d017e62639a0a3/hub/2021/04/19/31132fa6-2622-4ebe-995a-f52e20b7b218/2022-hyundai-tucson-limited-awd-ogi.jpg?auto=webp&fit=crop&height=900&width=1200"],
        userId: seller.id
      },
      {
        title: "2015 Audi A4 Premium Plus - German Engineering",
        make: "Audi",
        model: "A4",
        year: 2015,
        price: 18499,
        mileage: 65000,
        condition: "good",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Well-maintained Audi A4 with Premium Plus package. This luxury sedan features Quattro all-wheel drive, leather interior, and premium sound system.",
        features: ["Quattro All-Wheel Drive", "Leather Interior", "Sunroof", "Heated Seats", "Premium Sound"],
        location: "Boston, MA",
        images: ["https://media.ed.edmunds-media.com/audi/a4/2013/oem/2013_audi_a4_sedan_20t-premium-quattro_fq_oem_2_1600.jpg"],
        userId: seller.id
      },
      {
        title: "2019 Subaru Outback Premium - Adventure Ready",
        make: "Subaru",
        model: "Outback",
        year: 2019,
        price: 24995,
        mileage: 35800,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Versatile Subaru Outback ready for your next adventure. Features include all-wheel drive, roof rails, and Subaru's EyeSight safety system.",
        features: ["All-Wheel Drive", "Roof Rails", "Apple CarPlay", "Android Auto", "EyeSight Safety System"],
        location: "Boulder, CO",
        images: ["https://content-images.carmax.com/stockimages/2019/subaru/outback/st2400-089-evoxwebmedium.png", "https://file.kelleybluebookimages.com/kbb/base/evox/StJ/12830/2019-Subaru-Outback-rear-angle_12830_173_640x480.jpg"],
        userId: seller.id
      },
      {
        title: "2017 Lexus RX 350 - Luxury Crossover",
        make: "Lexus",
        model: "RX 350",
        year: 2017,
        price: 31500,
        mileage: 38000,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Elegant Lexus RX 350 with premium features and reliability. This luxury crossover offers a smooth ride, upscale interior, and advanced safety features.",
        features: ["Leather Interior", "Navigation", "Moonroof", "Heated/Ventilated Seats", "Premium Sound"],
        location: "Atlanta, GA",
        images: ["https://file.kelleybluebookimages.com/kbb/base/evox/CP/11159/2017-Lexus-RX-front_11159_032_1843x830_223_cropped.png"],
        userId: seller.id
      },
      {
        title: "2021 Volkswagen ID.4 Pro - Electric SUV",
        make: "Volkswagen",
        model: "ID.4",
        year: 2021,
        price: 39995,
        mileage: 11200,
        condition: "like_new",
        fuel: "electric",
        transmission: "automatic",
        description: "Modern Volkswagen ID.4 electric SUV with impressive range and technology. This eco-friendly vehicle offers zero emissions without compromising on space or comfort.",
        features: ["Electric Powertrain", "10-inch Touchscreen", "ID.Light", "Heated Seats", "Panoramic Glass Roof"],
        location: "Los Angeles, CA",
        images: ["https://www.digitaltrends.com/wp-content/uploads/2021/09/2021-volkswagen-id-4-awd-front-three-quarter.jpg?p=1"],
        userId: seller.id
      },
      {
        title: "2018 Jeep Wrangler Unlimited Rubicon - Off-Road Ready",
        make: "Jeep",
        model: "Wrangler",
        year: 2018,
        price: 38750,
        mileage: 29000,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "manual",
        description: "Capable Jeep Wrangler Unlimited Rubicon ready for off-road adventures. Features include 4x4, removable top, locking differentials, and disconnecting sway bars.",
        features: ["4x4", "Removable Top", "Locking Differentials", "Rock Rails", "Manual Transmission"],
        location: "Moab, UT",
        images: ["https://digital.pixelmotion.com/assets/theme/seo-page-builder/images/2018/Jeep/Wrangler%20JL%20Unlimited%20Rubicon/2018%20Jeep%20Wrangler%20JL%20Unlimited%20Rubicon%20Red%20Exterior%20Front.jpg"],
        userId: seller.id
      },
      {
        title: "2020 Kia Telluride SX - 3-Row Family SUV",
        make: "Kia",
        model: "Telluride",
        year: 2020,
        price: 39995,
        mileage: 22500,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Spacious Kia Telluride SX with three rows of seating. This award-winning SUV offers plenty of space for family and cargo, along with luxury features and safety technology.",
        features: ["7-Passenger Seating", "Leather Interior", "Harman Kardon Audio", "Sunroof", "360-degree Camera"],
        location: "Charlotte, NC",
        images: ["https://images.unsplash.com/photo-1580955526753-5530d5cc0cf3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
        userId: seller.id
      },
      {
        title: "2016 Mercedes-Benz C300 - Luxury Sedan",
        make: "Mercedes-Benz",
        model: "C300",
        year: 2016,
        price: 23950,
        mileage: 47000,
        condition: "good",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Elegant Mercedes-Benz C300 with premium features. This luxury sedan offers a comfortable ride, upscale interior, and advanced technology.",
        features: ["Leather Interior", "Navigation", "Panoramic Sunroof", "Heated Seats", "LED Headlights"],
        location: "Houston, TX",
        images: ["https://img2.carmax.com/assets/mmy-mercedes-benz-c300-2016/image/1.jpg?width=800&height=600"],
        userId: seller.id
      },
      {
        title: "2022 Ford Mustang Mach-E Premium - Electric SUV",
        make: "Ford",
        model: "Mustang Mach-E",
        year: 2022,
        price: 52800,
        mileage: 3900,
        condition: "new",
        fuel: "electric",
        transmission: "automatic",
        description: "Nearly new Ford Mustang Mach-E Premium electric SUV. This innovative vehicle combines the Mustang's heritage with modern electric technology.",
        features: ["Electric Powertrain", "15.5-inch Touchscreen", "Panoramic Glass Roof", "360-degree Camera", "B&O Sound System"],
        location: "Nashville, TN",
        images: ["https://build.ford.com/dig/Ford/Mustang/2022/HD-TILE/Image%5B%7CFord%7CMustang%7C2022%7C1%7C1.%7C200A.P8T..PB3..88E.891.~3ES00_BCMAC.DSS.SED.574.~BCMAC.13K.COU.59C.51H.PDS.LRS.LTS.646.T3H.RWD.453.99H.AFP.50B.77R.SSR.58E.SY3.AML.44X.EBST.PRE.ACT.%5D/EXT/1/vehicle.png", "https://inv.assets.sincrod.com/ChromeColorMatch/us/WHITE_cc_2022FOC050045_02_1280_B3.jpg"],
        userId: seller.id
      },
      {
        title: "2017 Toyota 4Runner SR5 - Adventure-Ready SUV",
        make: "Toyota",
        model: "4Runner",
        year: 2017,
        price: 32995,
        mileage: 51000,
        condition: "good",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Reliable Toyota 4Runner with off-road capabilities. This rugged SUV is perfect for adventures while still offering comfort for daily driving.",
        features: ["4x4", "Roof Rack", "Backup Camera", "Tow Package", "Running Boards"],
        location: "Phoenix, AZ",
        images: ["https://images.hgmsites.net/med/2017-toyota-4runner-limited-2wd-natl-angular-front-exterior-view_100602273_m.jpg"],
        userId: seller.id
      },
      {
        title: "2019 Dodge Challenger R/T - Muscle Car",
        make: "Dodge",
        model: "Challenger",
        year: 2019,
        price: 33750,
        mileage: 19500,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Powerful Dodge Challenger R/T with HEMI V8 engine. This American muscle car offers exhilarating performance and classic styling.",
        features: ["5.7L HEMI V8", "Sport Mode", "20-inch Wheels", "Apple CarPlay", "Android Auto"],
        location: "Las Vegas, NV",
        images: ["https://hips.hearstapps.com/hmg-prod/images/challenger1-1557774972.jpg", "https://di-uploads-pod26.dealerinspire.com/rickhendrickchryslerdodgejeepramduluth/uploads/2019/11/Challenger-Hero.png"],
        userId: seller.id
      },
      {
        title: "2020 Honda CR-V EX-L - Reliable Crossover",
        make: "Honda",
        model: "CR-V",
        year: 2020,
        price: 28495,
        mileage: 24300,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Dependable Honda CR-V EX-L with leather interior. This popular crossover offers excellent fuel economy, spacious interior, and Honda's reputation for reliability.",
        features: ["Leather Interior", "Sunroof", "Apple CarPlay", "Android Auto", "Honda Sensing Safety Suite"],
        location: "San Diego, CA",
        images: ["https://hips.hearstapps.com/hmg-prod/images/2020-honda-cr-v-hybrid-drive-109-1584417693.jpg"],
        userId: seller.id
      },
      {
        title: "2021 GMC Sierra 1500 AT4 - Off-Road Truck",
        make: "GMC",
        model: "Sierra 1500",
        year: 2021,
        price: 56995,
        mileage: 14500,
        condition: "like_new",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Capable GMC Sierra 1500 AT4 with off-road package. This premium truck combines luxury with rugged capability.",
        features: ["4x4", "2-inch Lift", "Off-Road Suspension", "MultiPro Tailgate", "Leather Interior"],
        location: "Salt Lake City, UT",
        images: ["https://di-sitebuilder-assets.dealerinspire.com/GMC/MLP/Sierra+1500/2021/Colors/Onyx+Black.jpg", "https://www.edmunds.com/assets/m/gmc/sierra-1500/2020/oem/2020_gmc_sierra-1500_crew-cab-pickup_at4_fq_oem_1_600.jpg"],
        userId: seller.id
      },
      {
        title: "2017 Nissan Rogue SL - Crossover with Safety Features",
        make: "Nissan",
        model: "Rogue",
        year: 2017,
        price: 19750,
        mileage: 45000,
        condition: "good",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Well-maintained Nissan Rogue SL with premium features. This crossover offers comfort, space, and advanced safety features.",
        features: ["Leather Interior", "Navigation", "360-degree Camera", "Blind Spot Monitoring", "Panoramic Sunroof"],
        location: "Philadelphia, PA",
        images: ["https://file.kelleybluebookimages.com/kbb/base/evox/CP/11703/2017-Nissan-Rogue-front_11703_032_1838x886_EAN_cropped.png"],
        userId: seller.id
      },
      {
        title: "2018 Chevrolet Bolt EV Premier - Electric Hatchback",
        make: "Chevrolet",
        model: "Bolt EV",
        year: 2018,
        price: 22995,
        mileage: 28000,
        condition: "excellent",
        fuel: "electric",
        transmission: "automatic",
        description: "Efficient Chevrolet Bolt EV with impressive range. This all-electric hatchback offers eco-friendly transportation with plenty of tech features.",
        features: ["Electric Powertrain", "10.2-inch Touchscreen", "360-degree Camera", "Heated Seats", "DC Fast Charging Capability"],
        location: "Sacramento, CA",
        images: ["https://www.motortrend.com/uploads/sites/11/2018/06/2018-Chevrolet-Bolt-EV-Premier-04.jpg", "https://www.motortrend.com/uploads/sites/10/2018/02/2018-chevrolet-bolt-ev-lt-hatchback-angular-front.png"],
        userId: seller.id
      },
      {
        title: "2019 Volvo XC60 T5 Momentum - Scandinavian Luxury",
        make: "Volvo",
        model: "XC60",
        year: 2019,
        price: 35750,
        mileage: 31200,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Elegant Volvo XC60 with Scandinavian design and advanced safety features. This luxury SUV offers comfort, style, and Volvo's reputation for safety.",
        features: ["Leather Interior", "Panoramic Sunroof", "City Safety", "Pilot Assist", "Harman Kardon Audio"],
        location: "Minneapolis, MN",
        images: ["https://img.sm360.ca/images//article/john-scotti-automotive/53915/file/volvo-xc50-concept_8d58b435456126711542734491188.jpg"],
        userId: seller.id
      },
      {
        title: "2016 Mazda MX-5 Miata Grand Touring - Convertible",
        make: "Mazda",
        model: "MX-5 Miata",
        year: 2016,
        price: 21995,
        mileage: 33000,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "manual",
        description: "Fun Mazda MX-5 Miata with manual transmission. This convertible sports car offers an engaging driving experience, perfect for sunny days and twisty roads.",
        features: ["Convertible Top", "Leather Seats", "Bose Audio", "Navigation", "Heated Seats"],
        location: "San Francisco, CA",
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPWL06lQHCtEvWmAEvgCER4r3SjnLVUhufGQ&s", "https://www.themanual.com/wp-content/uploads/sites/9/2015/09/2016-Mazda-MX-5-Miata-front-angle.jpg?p=1"],
        userId: seller.id
      },
      {
        title: "2020 Acura RDX A-Spec - Sport Luxury Crossover",
        make: "Acura",
        model: "RDX",
        year: 2020,
        price: 37995,
        mileage: 21300,
        condition: "excellent",
        fuel: "gasoline",
        transmission: "automatic",
        description: "Sporty Acura RDX A-Spec with premium features. This luxury crossover combines performance with comfort and advanced technology.",
        features: ["A-Spec Package", "Leather Interior", "ELS Studio Audio", "Panoramic Sunroof", "Super Handling All-Wheel Drive"],
        location: "Orlando, FL",
        images: ["https://cdn.dlron.us/static/dealer-16314/2020-Acura-RDX.jpg"],
        userId: seller.id
      }
    ];
    
    // Add all cars to storage
    for (const carInfo of carData) {
      // Ensure all enums are properly typed
      const car: InsertCar = {
        ...carInfo,
        // Type-safe casting for enum values
        condition: carInfo.condition as "new" | "like_new" | "excellent" | "good" | "fair" | "poor",
        fuel: carInfo.fuel as "gasoline" | "diesel" | "electric" | "hybrid" | "plug_in_hybrid" | "other",
        transmission: carInfo.transmission as "automatic" | "manual" | "semi_automatic"
      };
      await this.createCar(car);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt,
      name: insertUser.name || null,
      bio: null, 
      avatar: null 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Car operations
  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }
  
  async getCars(filters?: Partial<Car>): Promise<Car[]> {
    let cars = Array.from(this.cars.values());
    
    if (filters) {
      cars = cars.filter(car => {
        for (const [key, value] of Object.entries(filters)) {
          if (car[key as keyof Car] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Sort by newest first
    return cars.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getUserCars(userId: number): Promise<Car[]> {
    return this.getCars({ userId });
  }
  
  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.carIdCounter++;
    const createdAt = new Date();
    // Ensure null values for optional fields that might be undefined
    const car: Car = { 
      ...insertCar, 
      id, 
      createdAt,
      features: insertCar.features || null,
      images: insertCar.images || null
    };
    this.cars.set(id, car);
    return car;
  }
  
  async updateCar(id: number, carData: Partial<Car>): Promise<Car | undefined> {
    const car = await this.getCar(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...carData };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }
  
  async deleteCar(id: number): Promise<boolean> {
    return this.cars.delete(id);
  }
  
  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesBetweenUsers(userId1: number, userId2: number, carId?: number): Promise<Message[]> {
    const messages = Array.from(this.messages.values()).filter(msg => 
      ((msg.senderId === userId1 && msg.receiverId === userId2) || 
       (msg.senderId === userId2 && msg.receiverId === userId1)) &&
      (carId ? msg.carId === carId : true)
    );
    
    // Sort by date ascending
    return messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
  
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.senderId === userId || msg.receiverId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, read: false, createdAt };
    this.messages.set(id, message);
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getCarReviews(carId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.carId === carId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const createdAt = new Date();
    const review: Review = { ...insertReview, id, createdAt };
    this.reviews.set(id, review);
    return review;
  }
  
  // Favorite operations
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }
  
  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  
  async isFavorite(userId: number, carId: number): Promise<boolean> {
    return Array.from(this.favorites.values())
      .some(favorite => favorite.userId === userId && favorite.carId === carId);
  }
  
  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const createdAt = new Date();
    const favorite: Favorite = { ...insertFavorite, id, createdAt };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async deleteFavorite(userId: number, carId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.carId === carId);
      
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }
}

export const storage = new MemStorage();
