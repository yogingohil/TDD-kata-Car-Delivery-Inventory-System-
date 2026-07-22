import { UserRepository } from '../repositories/user.repository.js';
import { UserRole } from '../constants/roles.enum.js';

describe('UserRepository Unit Tests', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  it('should create and retrieve a user by email', async () => {
    const email = `repo_${Date.now()}@example.com`;
    const created = await userRepository.create({
      name: 'Repo User',
      email,
      password: 'HashedPassword123!',
      role: UserRole.USER,
    });

    expect(created._id).toBeDefined();
    expect(created.email).toBe(email);

    const found = await userRepository.findByEmail(email);
    expect(found).not.toBeNull();
    expect(found?.email).toBe(email);
  });

  it('should return null when searching for non-existent email', async () => {
    const found = await userRepository.findByEmail('nonexistent_email@example.com');
    expect(found).toBeNull();
  });

  it('should find user by id', async () => {
    const email = `repoid_${Date.now()}@example.com`;
    const created = await userRepository.create({
      name: 'ID User',
      email,
      password: 'HashedPassword123!',
      role: UserRole.USER,
    });

    const found = await userRepository.findById(created._id!.toString());
    expect(found).not.toBeNull();
    expect(found?.name).toBe('ID User');
  });

  it('should update user details', async () => {
    const email = `repoupdate_${Date.now()}@example.com`;
    const created = await userRepository.create({
      name: 'Old Name',
      email,
      password: 'HashedPassword123!',
      role: UserRole.USER,
    });

    const updated = await userRepository.update(created._id!.toString(), { name: 'New Name' });
    expect(updated?.name).toBe('New Name');
  });

  it('should delete user by id', async () => {
    const email = `repodelete_${Date.now()}@example.com`;
    const created = await userRepository.create({
      name: 'Delete User',
      email,
      password: 'HashedPassword123!',
      role: UserRole.USER,
    });

    const isDeleted = await userRepository.delete(created._id!.toString());
    expect(isDeleted).toBe(true);

    const found = await userRepository.findById(created._id!.toString());
    expect(found).toBeNull();
  });
});
