module.exports = (sequelize, DataTypes) => {

  const Players = sequelize.define('players', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.score,
    },
    weeklyScore: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.weeklyScore,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.level,
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.experience,
    },
    money: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.money,
    },
    badges: {
      type: DataTypes.TEXT,
      defaultValue: JsonReader.models.players.badges,
    },
    lastReportAt: {
      type: DataTypes.DATE,
      defaultValue: JsonReader.models.players.lastReportAt
    },
    entity_id: {
      type: DataTypes.INTEGER
    },
    guild_id: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.players.guild_id
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: require('moment')().format('YYYY-MM-DD HH:mm:ss')
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: require('moment')().format('YYYY-MM-DD HH:mm:ss')
    }
  }, {
    tableName: 'players',
    freezeTableName: true
  });

  Players.beforeSave((instance, options) => {
    instance.setDataValue('updatedAt', require('moment')().format('YYYY-MM-DD HH:mm:ss'));
  });

  /**
   * @param {Number} id
   */
  Players.getById = async (id) => {
    const query = `SELECT * FROM (SELECT id, RANK() OVER (ORDER BY score desc) rank, RANK() OVER (ORDER BY weeklyScore desc) weeklyRank FROM players) WHERE id = :id`;
    return await sequelize.query(query, { replacements: { id: id }, type: sequelize.QueryTypes.SELECT });
  };

  /**
   * @param {Number} rank
   */
  Players.getByRank = async (rank) => {
    const query = `SELECT * FROM (SELECT entity_id, RANK() OVER (ORDER BY score desc) rank, RANK() OVER (ORDER BY weeklyScore desc) weeklyRank FROM players) WHERE rank = :rank`;
    return await sequelize.query(query, { replacements: { rank: rank }, type: sequelize.QueryTypes.SELECT });
  };

  /**
   * @return {Number} Return the experience needed to level up.
   */
  Players.prototype.getExperienceNeededToLevelUp = function () {
    return JsonReader.models.players.xp[this.level + 1];
  };

  /**
   * @returns {Number} Return the experience used to level up.
   */
  Players.prototype.getExperienceUsedToLevelUp = function () {
    return JsonReader.models.players.xp[this.level];
  };

  /**
   * @param {Number} score
   */
  Players.prototype.addScore = function (score) {
    this.score += score;
    this.setScore(this.score);
  };

  /**
   * @param {Number} health
   */
  Players.prototype.addHealth = function (health) {
    this.health += health;
    this.sethealth(this.health);
  };

  /**
   * @param {Number} health
   */
  Players.prototype.sethealth = function (health) {
    if (health < 0) {
      // TODO: Kill the player (send death message and set skull status)
      this.health = 0;
    } else {
      if (health > this.maxHealth) {
        this.health = this.maxHealth;
      } else {
        this.health = health;
      }
    }
  };

  /**
   * @param {Number} score
   */
  Players.prototype.setScore = function (score) {
    if (score > 0) {
      this.score = score;
    } else {
      this.score = 0;
    }
  };

  /**
   * @param {Number} weeklyScore
   */
  Players.prototype.addWeeklyScore = function (weeklyScore) {
    this.weeklyScore += weeklyScore;
    this.setWeeklyScore(this.weeklyScore);
  };

  /**
   * @param {Number} weeklyScore
   */
  Players.prototype.setWeeklyScore = function (weeklyScore) {
    if (weeklyScore > 0) {
      this.weeklyScore = weeklyScore;
    } else {
      this.weeklyScore = 0;
    }
  };

  /**
   * @param {"fr"|"en"} language
   */
  Players.prototype.getPseudo = async function (language) {
    await this.setPseudo(language);
    return this.pseudo;
  };

  /**
   * @param {"fr"|"en"} language
   */
  Players.prototype.setPseudo = async function (language) {
    let entity = await this.getEntity();

    if (entity.discordUser_id !== undefined && client.users.cache.get(entity.discordUser_id) !== null) {
      this.pseudo = client.users.cache.get(entity.discordUser_id).username;
    } else {
      this.pseudo = JsonReader.models.players.getTranslation(language).pseudo;
    }
  };

  return Players;
};
