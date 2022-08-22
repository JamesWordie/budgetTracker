// External
import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { get } from "lodash";
// Config
import {
  findAllCategories,
  findACategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.services";
import log from "../logger";

/**
 * @function getAllCategories
 * @returns all categories
 */
const getAllCategories = async (req: Request, res: Response) => {
  const categories = await findAllCategories();

  return res.status(StatusCodes.OK).json({ categories });
};

/**
 * @function getACategory
 * @returns a singular category
 */
const getACategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const category = await findACategory({ _id: categoryId });

  return res.status(StatusCodes.OK).json({ category });
};

/**
 * @function createACategory
 * @returns the newly created category
 */
const createACategory = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");

  const category = await createCategory(userId, req.body);

  return res.status(StatusCodes.CREATED).json({ category });
};

/**
 * @function updateACategory
 * @returns makes request to update the resource, then it find it with the applied changes
 */
const updateACategory = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");
  const { categoryId } = req.params;
  const update = req.body;

  const category = await updateCategory(categoryId, userId, update);

  const updatedCategory = await findACategory({
    _id: category!._id,
  });

  return res.status(StatusCodes.OK).json({ category: updatedCategory });
};

/**
 * @function deleteACategory
 * @returns a successful deletion status code
 */
const deleteACategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  await deleteCategory(categoryId);

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export {
  getAllCategories,
  getACategory,
  createACategory,
  updateACategory,
  deleteACategory,
};
