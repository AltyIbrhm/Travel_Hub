const Redis = require('ioredis');
let redis = null;
let isRedisAvailable = false;

// Cache TTL in seconds
const CACHE_TTL = {
  PROFILE: 3600,          // 1 hour
  EMERGENCY: 3600,        // 1 hour
  PROFILE_PHOTO: 86400    // 24 hours
};

// Fallback in-memory cache
const memoryCache = {
  profiles: new Map(),
  emergencyContacts: new Map()
};

class CacheService {
  async getProfile(userId) {
    if (!isRedisAvailable) {
      return memoryCache.profiles.get(userId) || null;
    }
    try {
      const cached = await redis.get(`profile:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache error (getProfile):', error);
      return null;
    }
  }

  async setProfile(userId, profile) {
    if (!isRedisAvailable) {
      memoryCache.profiles.set(userId, profile);
      return;
    }
    try {
      await redis.setex(`profile:${userId}`, CACHE_TTL.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Cache error (setProfile):', error);
    }
  }

  async getEmergencyContact(userId) {
    if (!isRedisAvailable) {
      return memoryCache.emergencyContacts.get(userId) || null;
    }
    try {
      const cached = await redis.get(`emergency:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache error (getEmergencyContact):', error);
      return null;
    }
  }

  async setEmergencyContact(userId, contact) {
    if (!isRedisAvailable) {
      memoryCache.emergencyContacts.set(userId, contact);
      return;
    }
    try {
      await redis.setex(`emergency:${userId}`, CACHE_TTL.EMERGENCY, JSON.stringify(contact));
    } catch (error) {
      console.error('Cache error (setEmergencyContact):', error);
    }
  }

  async invalidateProfile(userId) {
    if (!isRedisAvailable) {
      memoryCache.profiles.delete(userId);
      return;
    }
    try {
      await redis.del(`profile:${userId}`);
    } catch (error) {
      console.error('Cache error (invalidateProfile):', error);
    }
  }

  async invalidateEmergencyContact(userId) {
    if (!isRedisAvailable) {
      memoryCache.emergencyContacts.delete(userId);
      return;
    }
    try {
      await redis.del(`emergency:${userId}`);
    } catch (error) {
      console.error('Cache error (invalidateEmergencyContact):', error);
    }
  }

  async invalidateAllUserData(userId) {
    if (!isRedisAvailable) {
      memoryCache.profiles.delete(userId);
      memoryCache.emergencyContacts.delete(userId);
      return;
    }
    try {
      await Promise.all([
        redis.del(`profile:${userId}`),
        redis.del(`emergency:${userId}`)
      ]);
    } catch (error) {
      console.error('Cache error (invalidateAllUserData):', error);
    }
  }
}

module.exports = new CacheService(); 