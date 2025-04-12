const Joi = require('joi');
const { User, ActivityLog, Court, Location, TblOrder, tblOrderCaseParties, TblOrderDocLocation } = require('../../models');
const sequelize = require('../../config/dbConfig');
const crypto = require('crypto');
const { DateTime } = require('luxon');
const { Sequelize } = require('sequelize');

let userAttributes = [
  "UserID",
  "UserName",
  "FullName",
  "Email",
  "FirmName",
  "Phone",
  "Address",
  "City",
  "State",
  "Zip",
  "AppAcctNo"
];




// Validation schemas
const participantSchema = Joi.object({
  PartyType: Joi.string().optional(),
  PartyName: Joi.string().optional(),
  RepresentID: Joi.number().integer().allow(null).optional(),
  PartyPhone: Joi.string().allow('').optional(),
  PartyAddress: Joi.string().allow('').optional(),
  PartyCity: Joi.string().allow('').optional(),
  PartyState: Joi.string().allow('').optional(),
  PartyZip: Joi.string().allow('').optional(),
  InsuranceClaim: Joi.string().allow('').optional(),
  InsuranceAdjuster: Joi.string().allow('').optional(),
  OpposingAttorney: Joi.string().allow('').optional(),
  Note: Joi.string().allow('').optional()
});

const documentLocationSchema = Joi.object({
  LocationName: Joi.string().required(),
  LocationAddress: Joi.string().required(),
  LocationCity: Joi.string().required(),
  LocationState: Joi.string().required(),
  LocationZip: Joi.string().required(),
  ProcessType: Joi.number().integer().required(),
  RecordType: Joi.number().integer().required(),
  Action: Joi.number().integer().required(),
  CopyForReview: Joi.boolean().default(false),
  DocFilePath: Joi.string().allow('').optional(),
  Note: Joi.string().allow('').optional()
});

const recordDetailsSchema = Joi.object({
  RecordType: Joi.string().valid("Person", "Entity").required(),
  PFirstName: Joi.string().allow('').optional(),
  PLastName: Joi.string().allow('').optional(),
  EName: Joi.string().allow('').optional(),
  PAKA: Joi.string().allow('').optional(),
  PSSN: Joi.string().allow('').optional(),

  date_of_injury: Joi.object({
    from: Joi.date().allow(null).optional(),
    to: Joi.date().greater(Joi.ref("from")).allow(null).optional()
  }).optional(),

  continuous_trauma: Joi.boolean().default(false),

  PAddress: Joi.string().allow('').optional(),
  PCity: Joi.string().allow('').optional(),
  PState: Joi.string().allow('').optional(),
  PZip: Joi.string().allow('').optional()
});

const orderSchema = Joi.object({
  UserID: Joi.number().integer().required(),
  IsRush: Joi.boolean().default(false),
  NeededBy: Joi.date().allow(null).optional(),
  CaseTypeID: Joi.number().integer().required(),
  CaseName: Joi.string().required(),
  FileNumber: Joi.string().required(),
  CaseNumber: Joi.string().required(),
  BillTo: Joi.string().required(),
  RequestStatus: Joi.string().valid("Active", "Completed", "Cancelled").default("Active"),

  CourtName: Joi.string().optional(),
  CourtAddress: Joi.string().optional(),
  CourtCity: Joi.string().optional(),
  CourtState: Joi.string().optional(),
  CourtZip: Joi.string().optional(),
  CourtTypeId: Joi.number().integer().allow(null).optional(),
  BranchID: Joi.number().integer().allow(null).optional(),

  record_details: recordDetailsSchema.required(),
  participants: Joi.array().items(participantSchema),
  document_locations: Joi.array().items(documentLocationSchema)
});

const bulkOrderSchema = Joi.object({
  UserID: Joi.number().integer().required(),
  IsRush: Joi.boolean().default(false),
  NeededBy: Joi.date().allow(null).optional(),
  CaseTypeID: Joi.number().integer().required(),
  CaseName: Joi.string().required(),
  FileNumber: Joi.string().required(),
  CaseNumber: Joi.string().required(),
  BillTo: Joi.string().required(),
  RequestStatus: Joi.string().valid("Active", "Completed", "Cancelled").default("Active"),

  CourtName: Joi.string().optional(),
  CourtAddress: Joi.string().optional(),
  CourtCity: Joi.string().optional(),
  CourtState: Joi.string().optional(),
  CourtZip: Joi.string().optional(),
  CourtTypeId: Joi.number().integer().allow(null).optional(),
  BranchID: Joi.number().integer().allow(null).optional(),

  record_details: recordDetailsSchema.required(),
  participants: Joi.array().items(participantSchema),
  document_locations: Joi.array().items(documentLocationSchema)
});


// CONTROLLER

const orderController = {
  create: async (req, res) => {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const {
        participants,
        document_locations,
        CourtName,
        CourtAddress,
        CourtCity,
        CourtState,
        CourtZip,
        branchid,
        CourtTypeId,
        record_details,
        ...orderData
      } = value;

      const timestamp = Date.now();
      const randomString = crypto.randomBytes(3).toString("hex");
      const OrderCode = `ORD-${timestamp}-${randomString}`;

      const [existingCourtLoc] = await sequelize.query(
        `SELECT TOP 1 * FROM dbo.location WHERE locat_name = :locat_name AND locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
        {
          replacements: {
            locat_name: CourtName,
            locat_address: CourtAddress,
            locat_city: CourtCity,
            locat_state: CourtState,
            locat_zip: CourtZip
          },
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!existingCourtLoc) {
        await sequelize.query(
          `INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip) VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip)`,
          {
            replacements: {
              locat_name: CourtName,
              locat_contact: "CUSTODIAN OF RECORDS",
              locat_address: CourtAddress,
              locat_city: CourtCity,
              locat_state: CourtState,
              locat_zip: CourtZip
            },
            type: sequelize.QueryTypes.INSERT
          }
        );
      }

      const [courtLocation] = await sequelize.query(
        `SELECT TOP 1 * FROM dbo.location WHERE locat_name = :locat_name AND locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
        {
          replacements: {
            locat_name: CourtName,
            locat_address: CourtAddress,
            locat_city: CourtCity,
            locat_state: CourtState,
            locat_zip: CourtZip
          },
          type: sequelize.QueryTypes.SELECT
        }
      );

      const [court] = await Court.findOrCreate({
        where: { locatid: courtLocation?.locatid },
        defaults: {
          locatid: courtLocation?.locatid,
          court_type: null,
          branchid: branchid || null,
          CourtTypeId: CourtTypeId || null
        }
      });

      if (participants?.length) {
        for (const p of participants) {
          const [existingLoc] = await sequelize.query(
            `SELECT TOP 1 * FROM dbo.location WHERE locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip AND locat_phone = :locat_phone`,
            {
              replacements: {
                locat_address: p.PartyAddress,
                locat_city: p.PartyCity,
                locat_state: p.PartyState,
                locat_zip: p.PartyZip,
                locat_phone: p.PartyPhone
              },
              type: sequelize.QueryTypes.SELECT
            }
          );

          if (!existingLoc) {
            await sequelize.query(
              `INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip, locat_phone) VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip, :locat_phone)`,
              {
                replacements: {
                  locat_name: p.PartyName,
                  locat_contact: "CUSTODIAN OF RECORDS",
                  locat_address: p.PartyAddress,
                  locat_city: p.PartyCity,
                  locat_state: p.PartyState,
                  locat_zip: p.PartyZip,
                  locat_phone: p.PartyPhone
                },
                type: sequelize.QueryTypes.INSERT
              }
            );
          }
        }
      }

      const documentLocationData = [];

      if (document_locations?.length) {
        for (const d of document_locations) {
          let locationId;

          const [existingDocLoc] = await sequelize.query(
            `SELECT TOP 1 * FROM dbo.location WHERE locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
            {
              replacements: {
                locat_address: d.LocationAddress,
                locat_city: d.LocationCity,
                locat_state: d.LocationState,
                locat_zip: d.LocationZip
              },
              type: sequelize.QueryTypes.SELECT
            }
          );

          if (!existingDocLoc) {
            await sequelize.query(`
              INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip)
              VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip)`,
              {
                replacements: {
                  locat_name: d.LocationName,
                  locat_contact: d.contact || "Unknown",
                  locat_address: d.LocationAddress,
                  locat_city: d.LocationCity,
                  locat_state: d.LocationState,
                  locat_zip: d.LocationZip
                },
                type: sequelize.QueryTypes.INSERT
              }
            );

            // 🔁 Then fetch locatid after insert
            const [fetched] = await sequelize.query(`
              SELECT TOP 1 locatid FROM dbo.location
              WHERE locat_name = :locat_name AND locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip
              ORDER BY locatid DESC`, {
              replacements: {
                locat_name: d.LocationName,
                locat_address: d.LocationAddress,
                locat_city: d.LocationCity,
                locat_state: d.LocationState,
                locat_zip: d.LocationZip
              },
              type: sequelize.QueryTypes.SELECT
            });

            locationId = fetched?.locatid;
          } else {
            locationId = existingDocLoc.locatid;
          }

          documentLocationData.push({
            ...d,
            LocationID: locationId,
            Uploaded: false,
            Downloaded: false
          });
        }

      }

      const result = await sequelize.transaction(async (t) => {
        let parsed;
        const dateInput = record_details?.date_of_injury?.from;

        if (dateInput) {
          parsed = new Date(dateInput);
          if (isNaN(parsed)) parsed = new Date();
        } else {
          parsed = new Date();
        }

        const formattedDate = parsed.toISOString().slice(0, 19).replace('T', ' ');

        const order = await TblOrder.create(
          {
            ...orderData,
            OrderCode,
            CreatedUserID: req.user.id,
            RequestStatus: "Active",
            CourtName,
            CourtAddress,
            CourtCity,
            CourtState,
            CourtZip,
            DateOfIncident: Sequelize.literal(`'${formattedDate}'`),
            CourtID: court?.court_id
          },
          {
            fields: [...Object.keys(orderData).filter(k => k !== 'record_details'),
              'OrderCode', 'CourtName', 'CourtAddress', 'CourtCity', 'CourtState', 'CourtZip', 'CourtID', 'DateOfIncident', 'CreatedUserID', 'RequestStatus'
            ],
            transaction: t
          }
        );

        if (record_details) {
          await order.update({ record_details }, { transaction: t });
        }

        if (participants?.length) {
          await Promise.all(
            participants.map((p) =>
              tblOrderCaseParties.create(
                { ...p, OrderID: order.OrderID },
                { transaction: t }
              )
            )
          );
        }

        if (documentLocationData?.length) {
          await Promise.all(
            document_locations.map(async (d) => {
              // Get LocationID properly
              const [locationRow] = await sequelize.query(
                `SELECT TOP 1 * FROM dbo.location WHERE locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
                {
                  replacements: {
                    locat_address: d.LocationAddress,
                    locat_city: d.LocationCity,
                    locat_state: d.LocationState,
                    locat_zip: d.LocationZip
                  },
                  type: sequelize.QueryTypes.SELECT,
                  transaction: t
                }
              );

              if (!locationRow?.locatid) {
                throw new Error("❌ Document Location not found or created — locatid is null.");
              }

              await TblOrderDocLocation.create(
                {
                  OrderID: order.OrderID,
                  LocationID: locationRow.locatid,
                  LocationName: d.LocationName,
                  LocationAddress: d.LocationAddress,
                  LocationCity: d.LocationCity,
                  LocationState: d.LocationState,
                  LocationZip: d.LocationZip,
                  ProcessType: d.ProcessType || null,
                  RecordType: d.RecordType || null,
                  Action: d.Action || null,
                  CopyForReview: d.CopyForReview || false,
                  Note: d.Note || null,
                  DocFilePath: d.DocFilePath || null,
                  Uploaded: false,
                  Downloaded: false,
                  DocRequestStatus: "New"
                },
                { transaction: t }
              );
            })
          );

        }

        return order;
      });


      const completeOrder = await TblOrder.findByPk(result.OrderID, {
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ]
      });


      await ActivityLog.create({
        order_id: completeOrder?.OrderID,
        action_type: "order_created",
        description:
          req.user.role === "admin"
            ? `Order {${completeOrder?.OrderCode}} created by user {${completeOrder?.createdByUser?.UserName}} on behalf of {${completeOrder?.orderByUser?.UserName}}.`
            : `Order {${completeOrder?.OrderCode}} created by user {${completeOrder?.createdByUser?.UserName}}.`
      });

      res.status(201).json(completeOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  create_bulk_orders: async (req, res) => {
    try {
      if (!Array.isArray(req.body.orders) || req.body.orders.length === 0) {
        return res.status(400).json({ error: "Invalid request. 'orders' must be a non-empty array." });
      }

      const createdOrders = [];

      // 🟢 STEP 1: Pre-create all required locations outside transaction
      for (const order of req.body.orders) {
        const { CourtName, CourtAddress, CourtCity, CourtState, CourtZip, BranchID, CourtTypeId, participants, document_locations } = order;

        const [existingCourtLoc] = await sequelize.query(
          `SELECT TOP 1 * FROM dbo.location WHERE locat_name = :locat_name AND locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
          {
            replacements: {
              locat_name: CourtName,
              locat_address: CourtAddress,
              locat_city: CourtCity,
              locat_state: CourtState,
              locat_zip: CourtZip
            },
            type: sequelize.QueryTypes.SELECT
          }
        );

        if (!existingCourtLoc) {
          await sequelize.query(
            `INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip) VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip)`,
            {
              replacements: {
                locat_name: CourtName,
                locat_contact: "CUSTODIAN OF RECORDS",
                locat_address: CourtAddress,
                locat_city: CourtCity,
                locat_state: CourtState,
                locat_zip: CourtZip
              },
              type: sequelize.QueryTypes.INSERT
            }
          );
        }

        if (participants?.length) {
          for (const p of participants) {
            const [existingLoc] = await sequelize.query(
              `SELECT TOP 1 * FROM dbo.location WHERE locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip AND locat_phone = :locat_phone`,
              {
                replacements: {
                  locat_address: p.PartyAddress,
                  locat_city: p.PartyCity,
                  locat_state: p.PartyState,
                  locat_zip: p.PartyZip,
                  locat_phone: p.PartyPhone
                },
                type: sequelize.QueryTypes.SELECT
              }
            );

            if (!existingLoc) {
              await sequelize.query(
                `INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip, locat_phone) VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip, :locat_phone)`,
                {
                  replacements: {
                    locat_name: p.PartyName,
                    locat_contact: "CUSTODIAN OF RECORDS",
                    locat_address: p.PartyAddress,
                    locat_city: p.PartyCity,
                    locat_state: p.PartyState,
                    locat_zip: p.PartyZip,
                    locat_phone: p.PartyPhone
                  },
                  type: sequelize.QueryTypes.INSERT
                }
              );
            }
          }
        }

        if (document_locations?.length) {
          for (const d of document_locations) {
            const [existingDocLoc] = await sequelize.query(
              `SELECT TOP 1 * FROM dbo.location WHERE locat_address = :locat_address AND locat_city = :locat_city AND locat_state = :locat_state AND locat_zip = :locat_zip`,
              {
                replacements: {
                  locat_address: d.LocationAddress,
                  locat_city: d.LocationCity,
                  locat_state: d.LocationState,
                  locat_zip: d.LocationZip
                },
                type: sequelize.QueryTypes.SELECT
              }
            );

            if (!existingDocLoc) {
              await sequelize.query(
                `INSERT INTO dbo.location (locat_name, locat_contact, locat_address, locat_city, locat_state, locat_zip) VALUES (:locat_name, :locat_contact, :locat_address, :locat_city, :locat_state, :locat_zip)`,
                {
                  replacements: {
                    locat_name: d.LocationName,
                    locat_contact: d.contact || "Unknown",
                    locat_address: d.LocationAddress,
                    locat_city: d.LocationCity,
                    locat_state: d.LocationState,
                    locat_zip: d.LocationZip
                  },
                  type: sequelize.QueryTypes.INSERT
                }
              );
            }
          }
        }
      }

      // 🟠 STEP 2: Create orders with transaction
      const results = await sequelize.transaction(async (t) => {
        for (const orderData of req.body.orders) {
          const { error, value } = bulkOrderSchema.validate(orderData);
          if (error) throw new Error(error.details[0].message);

          const {
            participants,
            document_locations,
            CourtName,
            CourtAddress,
            CourtCity,
            CourtState,
            CourtZip,
            BranchID,
            CourtTypeId,
            record_details,
            order_by,
            ...orderDetails
          } = value;

          const orderByUser = await User.findOne({ where: { UserName: order_by } });
          if (!orderByUser) throw new Error(`User '${order_by}' not found.`);

          const timestamp = Date.now();
          const randomString = crypto.randomBytes(3).toString("hex");
          const OrderCode = `ORD-${timestamp}-${randomString}`;

          const courtLocation = await Location.findOne({
            where: {
              locat_name: CourtName,
              locat_address: CourtAddress,
              locat_city: CourtCity,
              locat_state: CourtState,
              locat_zip: CourtZip
            }
          });

          const [court] = await Court.findOrCreate({
            where: { locatid: courtLocation.locatid },
            defaults: {
              locatid: courtLocation.locatid,
              court_type: null,
              branchid: BranchID || null,
              CourtTypeId: CourtTypeId || null
            },
            transaction: t
          });

          let parsed = record_details?.date_of_injury?.from ? new Date(record_details.date_of_injury.from) : new Date();
          if (isNaN(parsed)) parsed = new Date();
          const formattedDate = parsed.toISOString().slice(0, 19).replace("T", " ");

          const order = await TblOrder.create({
            ...orderDetails,
            OrderCode,
            UserID: orderByUser.UserID,
            CreatedUserID: req.user.UserID,
            RequestStatus: "Active",
            CourtName,
            CourtAddress,
            CourtCity,
            CourtState,
            CourtZip,
            DateOfIncident: Sequelize.literal(`'${formattedDate}'`),
            CourtID: court.court_id
          }, { transaction: t });

          if (record_details) {
            await order.update({ record_details }, { transaction: t });
          }

          if (participants && participants.length > 0) {
            await Promise.all(participants.map(p =>
              tblOrderCaseParties.create({ ...p, OrderID: order.OrderID }, { transaction: t })
            ));
          }

          if (document_locations && document_locations.length > 0) {
            await Promise.all(document_locations.map(async d => {
              const location = await Location.findOne({
                where: {
                  locat_address: d.LocationAddress,
                  locat_city: d.LocationCity,
                  locat_state: d.LocationState,
                  locat_zip: d.LocationZip
                }
              });

              if (!location) throw new Error("❌ Document Location not found");

              await TblOrderDocLocation.create({
                OrderID: order.OrderID,
                LocationID: location.locatid,
                LocationName: d.LocationName,
                LocationAddress: d.LocationAddress,
                LocationCity: d.LocationCity,
                LocationState: d.LocationState,
                LocationZip: d.LocationZip,
                ProcessType: d.ProcessType || null,
                RecordType: d.RecordType || null,
                Action: d.Action || null,
                CopyForReview: d.CopyForReview || false,
                Note: d.Note || null,
                DocFilePath: d.DocFilePath || null,
                Uploaded: false,
                Downloaded: false,
                DocRequestStatus: "New"
              }, { transaction: t });
            }));
          }

          createdOrders.push(order);
        }

        return createdOrders;
      });

      const completeOrders = await TblOrder.findAll({
        where: { OrderID: results.map(o => o.OrderID) },
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes }
        ]
      });

      for (const order of completeOrders) {
        await ActivityLog.create({
          order_id: order.OrderID,
          action_type: "order_created",
          description: req.user.role === "admin"
            ? `Order {${order.OrderCode}} created by admin {${req.user.username}}.`
            : `Order {${order.OrderCode}} created by user {${req.user.username}}.`
        });
      }

      return res.status(201).json({ success: true, data: completeOrders });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  },

  get_all: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { status, case_type, order_code, needed_by, created_by, order_by } = req.query;

      let whereClause = {}

      // Restrict to logged-in attorney’s orders
      if (req.user.role === "attorney") {
        whereClause.UserID = req.user.UserID;
      }

      // Dynamic filters
      if (status) whereClause.RequestStatus = status;
      if (case_type) whereClause.CaseTypeID = case_type;
      if (order_code) whereClause.OrderCode = order_code;
      if (needed_by) whereClause.NeededBy = needed_by;
      if (created_by) whereClause.CreatedUserID = created_by;
      if (order_by) whereClause.UserID = order_by;

      const { count, rows } = await TblOrder.findAndCountAll({
        where: whereClause,
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ],
        limit,
        offset,
        order: [['OrderID', 'DESC']],
        distinct: true
      });

      const formattedOrders = rows.map(order => {
        const json = order.toJSON();
        return {
          ...json,
          TblOrderDocLocations: (json.TblOrderDocLocations || []).map(doc => ({
            ...doc,
            files: doc.files ? JSON.parse(doc.files) : []
          }))
        };
      });

      return res.status(200).json({
        totalOrders: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        orders: formattedOrders
      });
    } catch (error) {
      console.error("❌ get_all error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  get_one: async (req, res) => {
    try {
      const whereClause = {
        OrderID: req.params.id,
      };

      // 🔒 Restrict for attorneys to only their own orders
      if (req.user.role === "attorney") {
        whereClause.UserID = req.user.UserID;
      }

      const order = await TblOrder.findOne({
        where: whereClause,
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ]
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const formatted = {
        ...order.toJSON(),
        TblOrderDocLocations: (order.toJSON().TblOrderDocLocations || []).map(doc => ({
          ...doc,
          // Parse files if they exist, otherwise set to empty array
          files: doc.files ? JSON.parse(doc.files) : []
        }))
      };

      return res.status(200).json(formatted);
    } catch (error) {
      console.error("❌ get_one error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  update: async (req, res) => {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const {
        participants,
        document_locations,
        CourtName,
        CourtAddress,
        CourtCity,
        CourtState,
        CourtZip,
        BranchID,
        CourtTypeId,
        ...orderData
      } = value;

      const result = await sequelize.transaction(async (t) => {
        // Step 1: Find existing order
        const order = await TblOrder.findByPk(req.params.id, { transaction: t });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Step 2: Find or Create court location
        const [courtLocation] = await Location.findOrCreate({
          where: {
            locat_name: CourtName,
            locat_address: CourtAddress,
            locat_city: CourtCity,
            locat_state: CourtState,
            locat_zip: CourtZip,
          },
          defaults: { locat_contact: "CUSTODIAN OF RECORDS" },
          transaction: t
        });

        // Step 3: Find or Create Court
        const [court] = await Court.findOrCreate({
          where: { locatid: courtLocation.locatid },
          defaults: {
            locatid: courtLocation.locatid,
            court_type: null,
            branchid: BranchID || null,
            CourtTypeId: CourtTypeId || null,
          },
          transaction: t
        });

        // Step 4: Update TblOrder
        await order.update({
          ...orderData,
          UpdatedBy: req.user.UserID,
          CourtName,
          CourtAddress,
          CourtCity,
          CourtState,
          CourtZip,
          BranchID: BranchID || null,
          CourtTypeId: CourtTypeId || null,
          CourtID: court?.court_id
        }, { transaction: t });

        // Step 5: Update Participants
        if (participants) {
          await tblOrderCaseParties.destroy({ where: { OrderID: req.params.id }, transaction: t });
          await Promise.all(
            participants.map(p =>
              tblOrderCaseParties.create({ ...p, OrderID: req.params.id }, { transaction: t })
            )
          );
        }

        // Step 6: Update Document Locations
        if (document_locations && document_locations.length) {
          await TblOrderDocLocation.destroy({ where: { OrderID: req.params.id }, transaction: t });

          await Promise.all(
            document_locations.map(async (d) => {
              const [location] = await Location.findOrCreate({
                where: {
                  locat_address: d.LocationAddress,
                  locat_city: d.LocationCity,
                  locat_state: d.LocationState,
                  locat_zip: d.LocationZip,
                },
                defaults: {
                  locat_name: d.LocationName,
                  locat_contact: d.contact || "Unknown",
                },
                transaction: t
              });

              await TblOrderDocLocation.create({
                OrderID: req.params.id,
                LocationID: location.locatid,
                LocationName: d.LocationName,
                LocationAddress: d.LocationAddress,
                LocationCity: d.LocationCity,
                LocationState: d.LocationState,
                LocationZip: d.LocationZip,
                ProcessType: d.ProcessType || null,
                RecordType: d.RecordType || null,
                Action: d.Action || null,
                CopyForReview: d.CopyForReview || false,
                Note: d.Note || null,
                DocFilePath: d.DocFilePath || null,
                Uploaded: false,
                Downloaded: false,
                DocRequestStatus: "Updated"
              }, { transaction: t });
            })
          );
        }

        return order;
      });

      // Step 7: Fetch updated order with associations
      const updatedOrder = await TblOrder.findByPk(req.params.id, {
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ]
      });

      // Step 8: Log activity
      if (value.RequestStatus === 'Cancelled') {
        await ActivityLog.create({
          order_id: updatedOrder.OrderID,
          action_type: 'order_cancelled',
          description: `Order {${updatedOrder.OrderCode}} has been cancelled by user {${updatedOrder?.updatedByUser?.UserName}}.`,
        });
      } else if (value.RequestStatus === 'In Progress') {
        await ActivityLog.create({
          order_id: updatedOrder.OrderID,
          action_type: 'order_started',
          description: `Order {${updatedOrder.OrderCode}} has been started by user {${updatedOrder?.updatedByUser?.UserName}}.`,
        });
      } else if (value.RequestStatus === 'Completed') {
        await ActivityLog.create({
          order_id: updatedOrder.OrderID,
          action_type: 'order_completed',
          description: `Order {${updatedOrder.OrderCode}} has been completed by user {${updatedOrder?.updatedByUser?.UserName}}.`,
        });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error("❌ update error:", error);
      res.status(500).json({ error: 'Server error' });
    }
  },


  delete: async (req, res) => {
    try {
      const order = await TblOrder.findByPk(req.params.id); // Make sure you're using `TblOrder` here
      const user = await User.findByPk(req.user.UserID);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // // ✅ Log delete action
      // await ActivityLog.create({
      //   order_id: order.OrderID,
      //   action_type: "order_cancelled",
      //   description: `Order {${order.OrderCode}} has been deleted by user {${user?.UserName}}.`,
      // });

      // ✅ Perform soft delete if paranoid enabled; else hard delete
      await TblOrder.destroy({
        where: { OrderID: req.params.id }
      });

      res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
      console.error("❌ Delete error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  cancel: async (req, res) => {
    try {
      const order = await TblOrder.findByPk(req.params.id);

      if (!order) return res.status(404).json({ error: 'Order not found' });

      if (order.RequestStatus === 'Completed') {
        return res.status(400).json({ error: 'Order already completed' });
      }

      if (order.RequestStatus === 'Cancelled') {
        return res.status(400).json({ error: 'Order already cancelled' });
      }

      // ✅ Update status
      await TblOrder.update(
        { RequestStatus: 'Cancelled' },
        { where: { OrderID: req.params.id } }
      );

      // ✅ Fetch updated order
      const updatedOrder = await TblOrder.findByPk(req.params.id, {
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ]
      });

      // ✅ Log activity
      await ActivityLog.create({
        order_id: updatedOrder.OrderID,
        action_type: 'order_cancelled',
        description: `Order {${updatedOrder.OrderCode}} has been cancelled by user {${req.user.username}}.`,
      });

      return res.status(200).json({ message: 'Order cancelled successfully', data: updatedOrder });
    } catch (error) {
      console.error("❌ Cancel error:", error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  complete: async (req, res) => {
    try {
      const order = await TblOrder.findByPk(req.params.id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.RequestStatus === 'Completed') {
        return res.status(400).json({ error: 'Order already completed' });
      }

      if (order.RequestStatus === 'Cancelled') {
        return res.status(400).json({ error: 'Order already cancelled' });
      }

      // ✅ Mark as Completed
      await TblOrder.update(
        { RequestStatus: 'Completed' },
        { where: { OrderID: req.params.id } }
      );

      const updatedOrder = await TblOrder.findByPk(req.params.id, {
        include: [
          { model: tblOrderCaseParties, required: false },
          { model: TblOrderDocLocation, required: false },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
        ]
      });

      // ✅ Log Activity
      await ActivityLog.create({
        order_id: updatedOrder.OrderID,
        action_type: 'order_completed',
        description: `Order {${updatedOrder.OrderCode}} has been completed by user {${req.user.username}}.`,
      });

      return res.status(200).json({ message: 'Order marked as completed', data: updatedOrder });
    } catch (error) {
      console.error("❌ Complete error:", error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateDocumentLocationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedByUser = await User.findByPk(req.user.UserID);

      // 🔒 Validate input
      if (!id) {
        return res.status(400).json({ error: "DocumentLocation ID is required." });
      }

      if (!status || !["New", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
      }

      // 🔍 Find document location
      const documentLocation = await TblOrderDocLocation.findByPk(id);

      if (!documentLocation) {
        return res.status(404).json({ error: "DocumentLocation not found." });
      }

      // ✅ Update status
      await documentLocation.update({ DocRequestStatus: status });

      // 📝 Create activity log
      let actionType, description;

      if (status === "Cancelled") {
        actionType = "document_location_cancelled";
        description = `Document location {${documentLocation.LocationName}} has been cancelled by user {${updatedByUser?.UserName || "Unknown"}}.`;
      } else if (status === "Completed") {
        actionType = "document_location_completed";
        description = `Document location {${documentLocation.LocationName}} has been completed by user {${updatedByUser?.UserName || "Unknown"}}.`;
      }

      // if (actionType && description) {
      //   await ActivityLog.create({
      //     order_id: documentLocation.OrderID,
      //     action_type: actionType,
      //     description,
      //   });
      // }

      return res.json({ message: "Document location status updated successfully." });
    } catch (error) {
      console.error("❌ Error updating document location status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

};

module.exports = orderController;