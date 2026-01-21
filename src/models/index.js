import Sequelize from "sequelize";
import sequelize from "../config/database.js";

// Core models
import UserModel from "./user.model.js";

// O2C & Transition
import OrderBookingModel from "../modules/forms/O2C/models/orderBooking.model.js";
import InventoryCountModel from "../modules/forms/Transition/models/InventoryCount.model.js";
import InwardChallanModel from "../modules/forms/Transition/models/InwardChallan.model.js";
import MaterialConsumptionModel from "../modules/forms/Transition/models/MaterialConsumption.model.js";
import ReturnMaterialModel from "../modules/forms/Transition/models/ReturnMaterial.model.js";
import VendorBillModel from "../modules/forms/Transition/models/VendorBill.model.js";
import VendorIssueMaterialModel from "../modules/forms/Transition/models/VendorIssueMaterial.model.js";
import ProfileModel from "../modules/forms/Profile/models/profile.model.js";

// Setup
import StateModel from "../modules/forms/Setup/models/state.model.js";
import LocationModel from "../modules/forms/Setup/models/location.model.js";
import DepartmentModel from "../modules/forms/Setup/models/department.model.js";
import CurrencyModel from "../modules/forms/Setup/models/currency.model.js";
import SubsidiaryModel from "../modules/forms/Setup/models/subsidiary.model.js";
import PaymentTeamModel from "../modules/forms/Setup/models/paymentTeam.model.js";
import SystemLogModel from "../modules/forms/Setup/models/systemLog.model.js";
import UtilitySettingModel from "../modules/forms/Setup/models/utilitySetting.model.js";
import CompanyDetailModel from "../modules/forms/Setup/models/CompanyDetail.model.js";
import CityModel from "../modules/forms/Setup/models/city.model.js";

// Master
import AccountTypeModel from "../modules/forms/Master/models/accountType.model.js";
import ChartOfAccountModel from "../modules/forms/Master/models/chartOfAccount.model.js";
import CustomerModel from "../modules/forms/Master/models/customer.model.js";
import ItemModel from "../modules/forms/Master/models/item.model.js";
import ItemGroupModel from "../modules/forms/Master/models/itemGroup.model.js";
import EmployeeModel from "../modules/forms/Master/models/employees.model.js";
import WarehouseModel from "../modules/forms/Master/models/warehouse.model.js";
import VendorModel from "../modules/forms/Master/models/vendor.model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Core
db.User = UserModel(sequelize, Sequelize.DataTypes);

// O2C & Transition, profile
db.OrderBooking = OrderBookingModel(sequelize, Sequelize.DataTypes);
db.AdminProfile = ProfileModel(sequelize, Sequelize.DataTypes);
db.InventoryCount = InventoryCountModel(sequelize, Sequelize.DataTypes);
db.InwardChallan = InwardChallanModel(sequelize, Sequelize.DataTypes);
db.MaterialConsumption = MaterialConsumptionModel(sequelize, Sequelize.DataTypes);
db.ReturnMaterial = ReturnMaterialModel(sequelize, Sequelize.DataTypes);
db.VendorBill = VendorBillModel(sequelize, Sequelize.DataTypes);
db.VendorIssueMaterial = VendorIssueMaterialModel(sequelize, Sequelize.DataTypes);

// Setup
db.State = StateModel(sequelize, Sequelize.DataTypes);
db.Location = LocationModel(sequelize, Sequelize.DataTypes);
db.Department = DepartmentModel(sequelize, Sequelize.DataTypes);
db.Currency = CurrencyModel(sequelize, Sequelize.DataTypes);
db.Subsidiary = SubsidiaryModel(sequelize, Sequelize.DataTypes);
db.PaymentTeam = PaymentTeamModel(sequelize, Sequelize.DataTypes);
db.SystemLog = SystemLogModel(sequelize, Sequelize.DataTypes);
db.UtilitySetting = UtilitySettingModel(sequelize, Sequelize.DataTypes);
db.CompanyDetail = CompanyDetailModel(sequelize, Sequelize.DataTypes);
db.City = CityModel(sequelize, Sequelize.DataTypes);

// Master
db.AccountType = AccountTypeModel(sequelize, Sequelize.DataTypes);
db.ChartOfAccount = ChartOfAccountModel(sequelize, Sequelize.DataTypes);
db.Customer = CustomerModel(sequelize, Sequelize.DataTypes);
db.Item = ItemModel(sequelize, Sequelize.DataTypes);
db.ItemGroup = ItemGroupModel(sequelize, Sequelize.DataTypes);
db.Employee = EmployeeModel(sequelize, Sequelize.DataTypes);
db.Warehouse = WarehouseModel(sequelize, Sequelize.DataTypes);
db.Vendor = VendorModel(sequelize, Sequelize.DataTypes);

export default db;
