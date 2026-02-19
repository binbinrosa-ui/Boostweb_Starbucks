const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, '이메일은 필수 항목입니다.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, '올바른 이메일 형식이 아닙니다.']
    },
    name: {
        type: String,
        required: [true, '이름은 필수 항목입니다.'],
        trim: true,
        minlength: [2, '이름은 최소 2자 이상이어야 합니다.'],
        maxlength: [50, '이름은 최대 50자까지 입력 가능합니다.']
    },
    password: {
        type: String,
        required: [true, '비밀번호는 필수 항목입니다.'],
        minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.'],
        select: false // 기본적으로 조회 시 비밀번호 제외
    },
    user_type: {
        type: String,
        enum: {
            values: ['고객', '관리자', '판매자'],
            message: '사용자 유형은 고객, 관리자, 판매자 중 하나여야 합니다.'
        },
        default: '고객'
    },
    address: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    versionKey: false // __v 필드 제거
});

// 비밀번호 해싱 미들웨어 (저장 전)
userSchema.pre('save', async function(next) {
    // 비밀번호가 변경되지 않았다면 다음으로 진행
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // 비밀번호 해싱 (10 rounds)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// JSON 변환 시 비밀번호 제외
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

