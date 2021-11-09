const {Sequelize, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "demographics",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING(255),
                // field:
            },
            last_name: {
                type: DataTypes.STRING(100),

            },
            alias: {
                type: DataTypes.STRING
            },
            nation: {
                type: DataTypes.INTEGER,
            },
            birth_day: {
                type: DataTypes.DATE,
            },
            birth_address: {
                type: DataTypes.STRING,
            },
            job: {
                type: DataTypes.STRING,
            },
            job_address: {
                type: DataTypes.STRING,
            },
            identity_card_number: {
                type: DataTypes.INTEGER,
            },
            identity_card_create_date: {
                type: DataTypes.STRING,

            },
            identity_card_address: {
                type: DataTypes.STRING,

            },
            register_resident_date: {
                type: DataTypes.STRING,

            },
            last_resident_address: {
                type: DataTypes.STRING,

            },
            relationship_with_header: {
                type: DataTypes.STRING,

            },
            role: {
                type: DataTypes.STRING,

            },
            status: {
                allowNull: false,
                type: DataTypes.STRING,

            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }

    )


}
