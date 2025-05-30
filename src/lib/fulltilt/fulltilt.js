/**
 * FULL TILT v1.1.1 - Complete Implementation
 * https://github.com/richtr/Full-Tilt
 * Full iOS 13+ Permissions Support
 * Modular version
 */

// Definizioni delle costanti
const M_PI = Math.PI;
const M_PI_2 = M_PI / 2;
const M_2_PI = 2 * M_PI;
const degToRad = M_PI / 180;
const radToDeg = 180 / M_PI;

// Sensor Manager
const sensors = {
  orientation: {
    active: false,
    callbacks: [],
    data: null
  },
  motion: {
    active: false,
    callbacks: [],
    data: null
  }
};

// Screen Orientation Handler
const screenOrientation = {
  angle: 0,
  update() {
    this.angle = (window.screen?.orientation?.angle ?? window.orientation ?? 0) * degToRad;
  },
  listening: false,
  start() {
    if (this.listening) return;
    window.addEventListener('orientationchange', this.update.bind(this));
    window.screen?.orientation?.addEventListener('change', this.update.bind(this));
    this.listening = true;
    this.update();
  }
};

// Permission Manager
const PermissionManager = {
  isIOS: typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,

  async request(type) {
    if (!this.isIOS) return 'granted';

    try {
      if (type === 'orientation' && typeof DeviceOrientationEvent?.requestPermission === 'function') {
        return await DeviceOrientationEvent.requestPermission();
      }
      if (type === 'motion' && typeof DeviceMotionEvent?.requestPermission === 'function') {
        return await DeviceMotionEvent.requestPermission();
      }
    } catch (error) {
      console.error('FullTilt: Permission request failed', error);
      return 'denied';
    }
    return 'granted';
  }
};

// Sensor Checker
class SensorChecker {
  constructor(sensorType, timeout = 2000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        if (sensors[sensorType].data) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`${sensorType} sensor timeout`));
        } else {
          setTimeout(check, 50);
        }
      };

      check();
    });
  }
}

// Event Handlers
function handleDeviceOrientation(event) {
  sensors.orientation.data = event;
  sensors.orientation.callbacks.forEach(cb => cb());
}

function handleDeviceMotion(event) {
  sensors.motion.data = event;
  sensors.motion.callbacks.forEach(cb => cb());
}

// Core API
const FULLTILT = {
  version: '1.1.1',

  async getDeviceOrientation(options = {}) {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      throw new Error('FullTilt requires secure context (HTTPS)');
    }

    try {
      const status = await PermissionManager.request('orientation');
      if (status !== 'granted') throw new Error('Orientation permission denied');

      const control = new FULLTILT.DeviceOrientation(options);
      control.start();
      await new SensorChecker('orientation');
      return control;

    } catch (error) {
      control?.stop();
      throw error;
    }
  },

  async getDeviceMotion(options = {}) {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      throw new Error('FullTilt requires secure context (HTTPS)');
    }

    try {
      const status = await PermissionManager.request('motion');
      if (status !== 'granted') throw new Error('Motion permission denied');

      const control = new FULLTILT.DeviceMotion(options);
      control.start();
      await new SensorChecker('motion');
      return control;

    } catch (error) {
      control?.stop();
      throw error;
    }
  },

  // Quaternion Class
  Quaternion: class {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.set(x, y, z, w);
    }

    set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      return this;
    }

    copy(quaternion) {
      this.x = quaternion.x;
      this.y = quaternion.y;
      this.z = quaternion.z;
      this.w = quaternion.w;
      return this;
    }

    setFromEuler(euler) {
      const alpha = euler.alpha * degToRad / 2;
      const beta = euler.beta * degToRad / 2;
      const gamma = euler.gamma * degToRad / 2;

      const cX = Math.cos(beta);
      const cY = Math.cos(gamma);
      const cZ = Math.cos(alpha);
      const sX = Math.sin(beta);
      const sY = Math.sin(gamma);
      const sZ = Math.sin(alpha);

      this.set(
        sX * cY * cZ - cX * sY * sZ,
        cX * sY * cZ + sX * cY * sZ,
        cX * cY * sZ - sX * sY * cZ,
        cX * cY * cZ + sX * sY * sZ
      );

      return this.normalize();
    }

    setFromRotationMatrix(matrix) {
      const m = matrix.elements;
      const m11 = m[0], m12 = m[1], m13 = m[2];
      const m21 = m[3], m22 = m[4], m23 = m[5];
      const m31 = m[6], m32 = m[7], m33 = m[8];

      const trace = m11 + m22 + m33;
      let s;

      if (trace > 0) {
        s = 0.5 / Math.sqrt(trace + 1.0);
        this.set(
          (m32 - m23) * s,
          (m13 - m31) * s,
          (m21 - m12) * s,
          0.25 / s
        );
      } else if (m11 > m22 && m11 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
        this.set(
          0.25 * s,
          (m12 + m21) / s,
          (m13 + m31) / s,
          (m32 - m23) / s
        );
      } else if (m22 > m33) {
        s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
        this.set(
          (m12 + m21) / s,
          0.25 * s,
          (m23 + m32) / s,
          (m13 - m31) / s
        );
      } else {
        s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
        this.set(
          (m13 + m31) / s,
          (m23 + m32) / s,
          0.25 * s,
          (m12 - m21) / s
        );
      }

      return this.normalize();
    }

    multiply(quaternion) {
      const qax = this.x, qay = this.y, qaz = this.z, qaw = this.w;
      const qbx = quaternion.x, qby = quaternion.y, qbz = quaternion.z, qbw = quaternion.w;

      this.set(
        qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
        qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
        qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
        qaw * qbw - qax * qbx - qay * qby - qaz * qbz
      );

      return this.normalize();
    }

    rotateX(angle) {
      const halfAngle = angle * degToRad / 2;
      const s = Math.sin(halfAngle);
      const c = Math.cos(halfAngle);

      const q = new FULLTILT.Quaternion(s, 0, 0, c);
      return this.multiply(q);
    }

    rotateY(angle) {
      const halfAngle = angle * degToRad / 2;
      const s = Math.sin(halfAngle);
      const c = Math.cos(halfAngle);

      const q = new FULLTILT.Quaternion(0, s, 0, c);
      return this.multiply(q);
    }

    rotateZ(angle) {
      const halfAngle = angle * degToRad / 2;
      const s = Math.sin(halfAngle);
      const c = Math.cos(halfAngle);

      const q = new FULLTILT.Quaternion(0, 0, s, c);
      return this.multiply(q);
    }

    normalize() {
      const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);

      if (length === 0) {
        this.set(0, 0, 0, 1);
      } else {
        this.x /= length;
        this.y /= length;
        this.z /= length;
        this.w /= length;
      }

      return this;
    }
  },

  // RotationMatrix Class
  RotationMatrix: class {
    constructor() {
      this.elements = new Float32Array(9);
      this.identity();
    }

    identity() {
      this.set(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      );
      return this;
    }

    set(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
      this.elements.set([m11, m12, m13, m21, m22, m23, m31, m32, m33]);
      return this;
    }

    copy(matrix) {
      this.elements.set(matrix.elements);
      return this;
    }

    setFromEuler(euler) {
      const alpha = euler.alpha * degToRad;
      const beta = euler.beta * degToRad;
      const gamma = euler.gamma * degToRad;

      const cA = Math.cos(alpha), sA = Math.sin(alpha);
      const cB = Math.cos(beta), sB = Math.sin(beta);
      const cG = Math.cos(gamma), sG = Math.sin(gamma);

      this.set(
        cA * cG - sA * sB * sG, -sA * cB, cA * sG + sA * sB * cG,
        sA * cG + cA * sB * sG, cA * cB, sA * sG - cA * sB * cG,
        -cB * sG, sB, cB * cG
      );

      return this.normalize();
    }

    setFromQuaternion(q) {
      const x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
      const xx = q.x * x2, xy = q.x * y2, xz = q.x * z2;
      const yy = q.y * y2, yz = q.y * z2, zz = q.z * z2;
      const wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;

      this.set(
        1 - (yy + zz), xy - wz, xz + wy,
        xy + wz, 1 - (xx + zz), yz - wx,
        xz - wy, yz + wx, 1 - (xx + yy)
      );

      return this;
    }

    multiply(matrix) {
      const a = this.elements;
      const b = matrix.elements;
      const out = new Float32Array(9);

      out[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
      out[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
      out[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

      out[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
      out[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
      out[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

      out[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
      out[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
      out[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

      this.elements.set(out);
      return this.normalize();
    }

    rotateX(angle) {
      const rad = angle * degToRad;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const m = this.elements;

      const m12 = m[1], m13 = m[2];
      const m22 = m[4], m23 = m[5];
      const m32 = m[7], m33 = m[8];

      m[1] = m12 * c + m13 * s;
      m[2] = m13 * c - m12 * s;
      m[4] = m22 * c + m23 * s;
      m[5] = m23 * c - m22 * s;
      m[7] = m32 * c + m33 * s;
      m[8] = m33 * c - m32 * s;

      return this.normalize();
    }

    rotateY(angle) {
      const rad = angle * degToRad;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const m = this.elements;

      const m11 = m[0], m13 = m[2];
      const m21 = m[3], m23 = m[5];
      const m31 = m[6], m33 = m[8];

      m[0] = m11 * c - m13 * s;
      m[2] = m11 * s + m13 * c;
      m[3] = m21 * c - m23 * s;
      m[5] = m21 * s + m23 * c;
      m[6] = m31 * c - m33 * s;
      m[8] = m31 * s + m33 * c;

      return this.normalize();
    }

    rotateZ(angle) {
      const rad = angle * degToRad;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const m = this.elements;

      const m11 = m[0], m12 = m[1];
      const m21 = m[3], m22 = m[4];
      const m31 = m[6], m32 = m[7];

      m[0] = m11 * c + m12 * s;
      m[1] = m12 * c - m11 * s;
      m[3] = m21 * c + m22 * s;
      m[4] = m22 * c - m21 * s;
      m[6] = m31 * c + m32 * s;
      m[7] = m32 * c - m31 * s;

      return this.normalize();
    }

    normalize() {
      const m = this.elements;
      const determinant =
        m[0] * (m[4] * m[8] - m[5] * m[7]) -
        m[1] * (m[3] * m[8] - m[5] * m[6]) +
        m[2] * (m[3] * m[7] - m[4] * m[6]);

      if (determinant !== 0) {
        const invDet = 1 / determinant;
        for (let i = 0; i < 9; i++) m[i] *= invDet;
      }

      return this;
    }
  },

  // Euler Class
  Euler: class {
    constructor(alpha = 0, beta = 0, gamma = 0) {
      this.set(alpha, beta, gamma);
    }

    set(alpha, beta, gamma) {
      this.alpha = alpha;
      this.beta = beta;
      this.gamma = gamma;
      return this;
    }

    copy(euler) {
      this.alpha = euler.alpha;
      this.beta = euler.beta;
      this.gamma = euler.gamma;
      return this;
    }

    setFromRotationMatrix(matrix) {
      const m = matrix.elements;
      let alpha, beta, gamma;

      if (m[8] > 0) {
        alpha = Math.atan2(-m[1], m[4]);
        beta = Math.asin(m[7]);
        gamma = Math.atan2(-m[6], m[8]);
      } else if (m[8] < 0) {
        alpha = Math.atan2(m[1], -m[4]);
        beta = -Math.asin(m[7]);
        beta += (beta >= 0) ? -M_PI : M_PI;
        gamma = Math.atan2(m[6], -m[8]);
      } else {
        alpha = Math.atan2(m[3], m[0]);
        beta = (m[7] > 0) ? M_PI_2 : -M_PI_2;
        gamma = 0;
      }

      this.alpha = ((alpha * radToDeg) + 360) % 360;
      this.beta = beta * radToDeg;
      this.gamma = gamma * radToDeg;

      return this;
    }

    setFromQuaternion(q) {
      const sqw = q.w ** 2;
      const sqx = q.x ** 2;
      const sqy = q.y ** 2;
      const sqz = q.z ** 2;

      const unit = sqx + sqy + sqz + sqw;
      const test = q.x * q.y + q.z * q.w;

      if (test > 0.499 * unit) {
        this.alpha = 2 * Math.atan2(q.x, q.w) * radToDeg;
        this.beta = 90;
        this.gamma = 0;
      } else if (test < -0.499 * unit) {
        this.alpha = -2 * Math.atan2(q.x, q.w) * radToDeg;
        this.beta = -90;
        this.gamma = 0;
      } else {
        this.alpha = Math.atan2(2 * (q.y * q.w - q.x * q.z), sqx - sqy - sqz + sqw) * radToDeg;
        this.beta = Math.asin(2 * test / unit) * radToDeg;
        this.gamma = Math.atan2(2 * (q.x * q.w - q.y * q.z), -sqx + sqy - sqz + sqw) * radToDeg;
      }

      return this;
    }

    rotateX(angle) {
      const matrix = new FULLTILT.RotationMatrix().setFromEuler(this);
      matrix.rotateX(angle);
      return this.setFromRotationMatrix(matrix);
    }

    rotateY(angle) {
      const matrix = new FULLTILT.RotationMatrix().setFromEuler(this);
      matrix.rotateY(angle);
      return this.setFromRotationMatrix(matrix);
    }

    rotateZ(angle) {
      const matrix = new FULLTILT.RotationMatrix().setFromEuler(this);
      matrix.rotateZ(angle);
      return this.setFromRotationMatrix(matrix);
    }
  }
};

// DeviceOrientation Class
FULLTILT.DeviceOrientation = class {
  constructor(options = {}) {
    this.options = options || {};
    this.alphaOffsetScreen = 0;
    this.alphaOffsetDevice = null;

    // Aggiunta della logica di calibrazione originale
    let tries = 0;
    const maxTries = 200;
    const successThreshold = 10;
    let successCount = 0;

    if (this.options.type === "world") {
      const setCompassAlphaOffset = (evt) => {
        if (evt.absolute !== true && evt.webkitCompassAccuracy < 50) {
          this.alphaOffsetDevice = new FULLTILT.Euler(evt.webkitCompassHeading, 0, 0);
          this.alphaOffsetDevice.rotateZ(screenOrientation.angle);
          this.alphaOffsetScreen = screenOrientation.angle;

          if (++successCount >= successThreshold) {
            window.removeEventListener('deviceorientation', setCompassAlphaOffset);
          }
        }

        if (++tries >= maxTries) {
          window.removeEventListener('deviceorientation', setCompassAlphaOffset);
        }
      };

      window.addEventListener('deviceorientation', setCompassAlphaOffset);
    }
  }

  // Aggiunta di tutti i metodi mancanti dalla versione originale
  getFixedFrameQuaternion() {
    const euler = new FULLTILT.Euler();
    const matrix = new FULLTILT.RotationMatrix();
    const quaternion = new FULLTILT.Quaternion();

    const orientationData = sensors.orientation.data || { alpha: 0, beta: 0, gamma: 0 };
    let adjustedAlpha = orientationData.alpha;

    if (this.alphaOffsetDevice) {
      matrix.setFromEuler(this.alphaOffsetDevice);
      matrix.rotateZ(-this.alphaOffsetScreen);
      euler.setFromRotationMatrix(matrix);
      adjustedAlpha -= euler.alpha % 360;
    }

    euler.set(adjustedAlpha, orientationData.beta, orientationData.gamma);
    quaternion.setFromEuler(euler);
    return quaternion;
  }

  getScreenAdjustedQuaternion() {
    const quaternion = this.getFixedFrameQuaternion();
    quaternion.rotateZ(-screenOrientation.angle);
    return quaternion;
  }

  getFixedFrameMatrix() {
    const euler = new FULLTILT.Euler();
    const matrix = new FULLTILT.RotationMatrix();

    const orientationData = sensors.orientation.data || { alpha: 0, beta: 0, gamma: 0 };
    let adjustedAlpha = orientationData.alpha;

    if (this.alphaOffsetDevice) {
      matrix.setFromEuler(this.alphaOffsetDevice);
      matrix.rotateZ(-this.alphaOffsetScreen);
      euler.setFromRotationMatrix(matrix);
      adjustedAlpha -= euler.alpha % 360;
    }

    euler.set(adjustedAlpha, orientationData.beta, orientationData.gamma);
    matrix.setFromEuler(euler);
    return matrix;
  }

  getScreenAdjustedMatrix() {
    const matrix = this.getFixedFrameMatrix();
    matrix.rotateZ(-screenOrientation.angle);
    return matrix;
  }

  getFixedFrameEuler() {
    const euler = new FULLTILT.Euler();
    const matrix = this.getFixedFrameMatrix();
    euler.setFromRotationMatrix(matrix);
    return euler;
  }

  getScreenAdjustedEuler() {
    const euler = new FULLTILT.Euler();
    const matrix = this.getScreenAdjustedMatrix();
    euler.setFromRotationMatrix(matrix);
    return euler;
  }

  start() {
    if (!sensors.orientation.active) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      sensors.orientation.active = true;
    }
    screenOrientation.start();
    return this;
  }

  stop() {
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    sensors.orientation.active = false;
    return this;
  }

  listen(callback) {
    if (typeof callback === 'function') {
      sensors.orientation.callbacks.push(callback);
    }
    return this;
  }
};

// DeviceMotion Class
FULLTILT.DeviceMotion = class {
  constructor(options = {}) {
    this.options = options;
  }

  start() {
    if (!sensors.motion.active) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      sensors.motion.active = true;
    }
    screenOrientation.start();
    return this;
  }

  stop() {
    window.removeEventListener('devicemotion', handleDeviceMotion);
    sensors.motion.active = false;
    return this;
  }

  listen(callback) {
    if (typeof callback === 'function') {
      sensors.motion.callbacks.push(callback);
    }
    return this;
  }

  getScreenAdjustedAcceleration() {
    if (!sensors.motion.data?.acceleration) {
      return { x: 0, y: 0, z: 0 };
    }

    const acc = sensors.motion.data.acceleration;
    const angle = screenOrientation.angle * radToDeg;
    const output = { x: 0, y: 0, z: acc.z || 0 };

    switch (Math.round(angle)) {
      case 90:
        output.x = -acc.y;
        output.y = acc.x;
        break;
      case 180:
        output.x = -acc.x;
        output.y = -acc.y;
        break;
      case 270:
        output.x = acc.y;
        output.y = -acc.x;
        break;
      default:
        output.x = acc.x;
        output.y = acc.y;
    }

    return output;
  }
};

// Esporta l'oggetto FULLTILT come modulo ES
export default FULLTILT;

// Per retrocompatibilità con il codice che potrebbe usare window.FULLTILT
if (typeof window !== 'undefined') {
  window.FULLTILT = FULLTILT;
}