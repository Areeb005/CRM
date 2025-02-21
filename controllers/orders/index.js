const Joi = require('joi');
const { Order, Participant, DocumentLocation, User } = require('../../models');
const sequelize = require('../../config/dbConfig');



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
  type: Joi.string().valid('Attorney', 'Adjuster', 'Claim', 'Other').required(),
  represents: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  zip: Joi.string().allow('').optional(),
  claim_adjuster: Joi.string().allow('').optional(),
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

const orderSchema = Joi.object({
  // Order details
  order_by: Joi.number().integer().required(),
  urgent: Joi.boolean().default(false),
  needed_by: Joi.date().required(),
  case_type: Joi.string().required(),
  case_name: Joi.string().required(),
  file_number: Joi.string().required(),
  case_number: Joi.string().required(),

  // Court details
  court_name: Joi.string().required(),
  court_address: Joi.string().required(),
  court_city: Joi.string().required(),
  court_state: Joi.string().required(),
  court_zip: Joi.string().required(),

  // Record details
  record_type: Joi.string().valid('Person', 'Entity').required(),
  first_name: Joi.string().allow('').optional(),
  last_name: Joi.string().allow('').optional(),
  aka: Joi.string().allow('').optional(),
  ssn: Joi.string().allow('').optional(),
  date_of_injury: Joi.date().allow(null).optional(),
  record_address: Joi.string().allow('').optional(),
  record_city: Joi.string().allow('').optional(),
  record_state: Joi.string().allow('').optional(),
  record_zip: Joi.string().allow('').optional(),

  // Billing and metadata
  bill_to: Joi.string().required(),
  created_by: Joi.number().integer().required(),
  updated_by: Joi.number().integer().allow(null).optional(),

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

      // Create order with associations in a transaction
      const result = await sequelize.transaction(async (t) => {
        // Create the order
        const order = await Order.create(orderData, { transaction: t });

        // Create participants if provided
        if (participants && participants.length > 0) {
          await Promise.all(
            participants.map(participant =>
              Participant.create({
                ...participant,
                order_id: order.id
              }, { transaction: t })
            )
          );
        }

        // Create document locations if provided
        if (document_locations && document_locations.length > 0) {
          await Promise.all(
            document_locations.map(docLocation =>
              DocumentLocation.create({
                ...docLocation,
                order_id: order.id
              }, { transaction: t })
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
          { model: User, attributes: userAttributes }
        ]
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
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, attributes: userAttributes }
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
      const order = await Order.findByPk(req.params.id, {
        include: [
          { model: Participant },
          { model: DocumentLocation },
          { model: User, attributes: userAttributes }
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
          { model: User, attributes: userAttributes }
        ]
      });

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
  }
};

module.exports = orderController;