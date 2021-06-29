package id.co.bca.pakar.be.doc.service;

import id.co.bca.pakar.be.doc.dto.StructureDto;
import id.co.bca.pakar.be.doc.dto.StructureResponseDto;
import id.co.bca.pakar.be.doc.dto.StructureWithFileDto;
import id.co.bca.pakar.be.doc.exception.DataNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StructureService {
	StructureDto add(String username, StructureDto dto, MultipartFile image, MultipartFile icon) throws Exception;
	StructureResponseDto add(String username, StructureWithFileDto dto) throws Exception;
	StructureResponseDto update(String username, StructureWithFileDto dto) throws DataNotFoundException, Exception;
	StructureDto delete(Long structureId) throws Exception;
	List<StructureDto> add(String username, List<StructureWithFileDto> dtoList) throws Exception;
}