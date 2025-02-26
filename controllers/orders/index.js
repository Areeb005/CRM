const Joi = require('joi');
const { Order, Participant, DocumentLocation, User, ActivityLog } = require('../../models');
const sequelize = require('../../config/dbConfig');
const crypto = require('crypto');

let userAttributes = [
  "id",
  "username",
  "full_name",
  "profile_picture",
  "email",
  "firm_name",
  "phone",
  "address",
  "state",
  "zip",
  "app_acc_no",
]




// Validation schemas
const participantSchema = Joi.object({
  type: Joi.string().required(),
  participant: Joi.string().required(),
  represents: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  zip: Joi.string().allow('').optional(),
  claim: Joi.string().allow('').optional(),
  adjuster: Joi.string().allow('').optional(),
  attorney: Joi.string().allow('').optional(),
  note: Joi.string().allow('').optional()
});

const documentLocationSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.string().required(),
  process_type: Joi.string().required(),
  record_type: Joi.string().required(),
  action: Joi.string().required(),
  review_request: Joi.boolean().default(false),
  files: Joi.array().items(Joi.string()).default([]),
  note: Joi.string().allow('').optional()
});

// Record Details Schema
const recordDetailsSchema = Joi.object({
  record_type: Joi.string().valid("Person", "Entity").required(),
  first_name: Joi.string().allow("").optional(),
  last_name: Joi.string().allow("").optional(),
  name: Joi.string().allow("").optional(),
  aka: Joi.string().allow("").optional(),
  ssn: Joi.string().allow("").optional(),

  // Date of Injury Range
  date_of_injury: Joi.object({
    from: Joi.date().allow(null).optional(),
    to: Joi.date().greater(Joi.ref("from")).allow(null).optional(),
  }).optional(),

  record_address: Joi.string().allow("").optional(),
  record_city: Joi.string().allow("").optional(),
  record_state: Joi.string().allow("").optional(),
  record_zip: Joi.string().allow("").optional(),
});



const orderSchema = Joi.object({
  // Order details
  order_by: Joi.number().integer().required(),
  urgent: Joi.boolean().default(false),
  needed_by: Joi.date().optional(),
  case_type: Joi.string().required(),
  case_name: Joi.string().required(),
  file_number: Joi.string().required(),
  case_number: Joi.string().required(),
  status: Joi.string().valid("New",
    "In Progress",
    "Completed",
    "Cancelled",
    "Hold").default('pending'),

  // Court details
  court_name: Joi.string().required(),
  court_address: Joi.string().required(),
  court_city: Joi.string().required(),
  court_state: Joi.string().required(),
  court_zip: Joi.string().required(),

  // Record details
  record_details: recordDetailsSchema.required(),

  // Billing and metadata
  bill_to: Joi.string().required(),
  // Related records
  participants: Joi.array().items(participantSchema),
  document_locations: Joi.array().items(documentLocationSchema)
});

const orderController = {
  create: async (req, res) => {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { participants, document_locations, ...orderData } = value;

      // Generate unique order code
      const timestamp = Date.now(); // Get current timestamp
      const randomString = crypto.randomBytes(3).toString("hex"); // Generate a 6-character hex string
      const orderCode = `ORD-${timestamp}-${randomString}`; // Format: ORD-1732695633-6baac8

      // Create order with associations in a transaction
      const result = await sequelize.transaction(async (t) => {
        // Create the order with the generated orderCode
        const order = await Order.create({
          ...orderData,
          order_code: orderCode, // Assign generated order code
          created_by: req.user.id,
          updated_by: req.user.id,
          status: "New"
        }, { transaction: t });

        // Create participants if provided
        if (participants && participants.length > 0) {
          await Promise.all(
            participants.map(participant =>
              Participant.create({ ...participant, order_id: order.id }, { transaction: t })
            )
          );
        }

        // Create document locations if provided
        if (document_locations && document_locations.length > 0) {
          await Promise.all(
            document_locations.map(docLocation =>
              DocumentLocation.create({ ...docLocation, order_id: order.id, status: "New" }, { transaction: t })
            )
          );
        }

        return order;
      });

      // Fetch the complete order with associations
      const completeOrder = await Order.findByPk(result.id, {
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
          { model: User, as: "updatedByUser", attributes: userAttributes },
        ]
      });

      // Log activity
      await ActivityLog.create({
        order_id: completeOrder?.id,
        action_type: 'order_created',
        description: req.user.role === "admin" ?
          `Order {${completeOrder?.id}} created by user {${completeOrder?.createdByUser?.username}} on behalf of {${completeOrder?.orderByUser?.username}}.` :
          `Order {${completeOrder?.id}} created by user {${completeOrder?.createdByUser?.username}}.`,
      });

      res.status(201).json(completeOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  get_all: async (req, res) => {
    try {
      const orders = await Order.findAll({
        ...(req.user.role === "attorney" ? { where: { order_by: req.user.id } } : {}),
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
          { model: User, as: "updatedByUser", attributes: userAttributes },
        ]
      });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  get_one: async (req, res) => {
    try {

      const order = await Order.findOne({
        where: {
          id: req.params.id,
          ...(req.user.role === "attorney" ? { order_by: req.user.id } : {}),
        },
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
          { model: User, as: "updatedByUser", attributes: userAttributes },
        ]
      });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { participants, document_locations, ...orderData } = value;

      const result = await sequelize.transaction(async (t) => {
        // Update order
        const [updated] = await Order.update(orderData, {
          where: { id: req.params.id },
          transaction: t
        });

        if (!updated) return res.status(404).json({ error: 'Order not found' });

        // Update participants
        if (participants) {
          await Participant.destroy({
            where: { order_id: req.params.id },
            transaction: t
          });

          await Promise.all(
            participants.map(participant =>
              Participant.create({
                ...participant,
                order_id: req.params.id
              }, { transaction: t })
            )
          );
        }

        // Update document locations
        if (document_locations) {
          await DocumentLocation.destroy({
            where: { order_id: req.params.id },
            transaction: t
          });

          await Promise.all(
            document_locations.map(docLocation =>
              DocumentLocation.create({
                ...docLocation,
                order_id: req.params.id
              }, { transaction: t })
            )
          );
        }

        return true;
      });



      const updatedOrder = await Order.findByPk(req.params.id, {
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, as: "orderByUser", attributes: userAttributes },
          { model: User, as: "createdByUser", attributes: userAttributes },
          { model: User, as: "updatedByUser", attributes: userAttributes },
        ]
      });


      if (value.status === 'Cancelled') {
        await ActivityLog.create({
          order_id: req.params.id,
          action_type: 'order_cancelled',
          description: `Order {${req.params.id}} has been cancelled by user {${updatedOrder?.updatedByUser?.username}}.`,
        });
      }
      else if (value.status === 'In Progress') {
        await ActivityLog.create({
          order_id: req.params.id,
          action_type: 'order_started',
          description: `Order {${req.params.id}} has been started by user {${updatedOrder?.updatedByUser?.username}}.`,
        });
      }
      else if (value.status === 'Completed') {
        await ActivityLog.create({
          order_id: req.params.id,
          action_type: 'order_completed',
          description: `Order {${req.params.id}} has been completed by user {${updatedOrder?.updatedByUser?.username}}.`,
        });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Order.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) return res.status(404).json({ error: 'Order not found' });

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateDocumentLocationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // Assuming is sent from frontend

      const updatedByUser = await User.findByPk(req.user.id);

      // Validate input
      if (!id) {
        return res.status(400).json({ error: "DocumentLocation ID is required." });
      }

      if (!status || !["New", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
      }

      // Find the DocumentLocation by ID
      const documentLocation = await DocumentLocation.findByPk(id);

      if (!documentLocation) {
        return res.status(404).json({ error: "DocumentLocation not found." });
      }

      // Update the status
      await documentLocation.update({ status });

      // Create activity log
      let actionType, description;
      if (status === "Cancelled") {
        actionType = "document_location_cancelled";
        description = `DocumentLocation {${id}} has been cancelled by user {${updatedByUser?.username || "Unknown"}}.`;
      } else if (status === "Completed") {
        actionType = "document_location_completed";
        description = `DocumentLocation {${id}} has been completed by user {${updatedByUser?.username || "Unknown"}}.`;
      }

      if (actionType && description) {
        await ActivityLog.create({
          order_id: documentLocation.order_id, // Assuming it's related to an order_id, adjust if necessary
          action_type: actionType,
          description: description,
        });
      }

      res.json({ message: "Status updated successfully." });

    } catch (error) {
      console.error("Error updating document location status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

module.exports = orderController;